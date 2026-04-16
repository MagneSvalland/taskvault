package com.taskvault.backend.service;

import com.taskvault.backend.dto.TaskRequest;
import com.taskvault.backend.dto.TaskResponse;
import com.taskvault.backend.entity.Task;
import com.taskvault.backend.entity.User;
import com.taskvault.backend.repository.TaskRepository;
import com.taskvault.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User user;
    private Task task;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("encoded");

        task = new Task();
        task.setId(1L);
        task.setTitle("Test task");
        task.setPriority(Task.Priority.MEDIUM);
        task.setStatus(Task.Status.ACTIVE);
        task.setUser(user);
    }

    @Test
    void getTasks_returnsTasksForUser() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(taskRepository.findByUserId(1L)).thenReturn(List.of(task));

        List<TaskResponse> result = taskService.getTasks("testuser");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Test task");
    }

    @Test
    void getTasks_throwsWhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.getTasks("unknown"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void createTask_savesAndReturnsTask() {
        TaskRequest request = new TaskRequest();
        request.setTitle("New task");
        request.setPriority(Task.Priority.HIGH);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> {
            Task t = inv.getArgument(0);
            t.setId(2L);
            return t;
        });

        TaskResponse result = taskService.createTask(request, "testuser");

        assertThat(result.getTitle()).isEqualTo("New task");
        assertThat(result.getPriority()).isEqualTo(Task.Priority.HIGH);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_defaultsMediumPriorityWhenNull() {
        TaskRequest request = new TaskRequest();
        request.setTitle("Task without priority");
        request.setPriority(null);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse result = taskService.createTask(request, "testuser");

        assertThat(result.getPriority()).isEqualTo(Task.Priority.MEDIUM);
    }

    @Test
    void deleteTask_deletesWhenAuthorized() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        taskService.deleteTask(1L, "testuser");

        verify(taskRepository, times(1)).delete(task);
    }

    @Test
    void deleteTask_throwsWhenNotAuthorized() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        assertThatThrownBy(() -> taskService.deleteTask(1L, "otheruser"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Not authorized");
    }

    @Test
    void toggleStatus_switchesFromActiveToCompleted() {
        task.setStatus(Task.Status.ACTIVE);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse result = taskService.toggleStatus(1L, "testuser");

        assertThat(result.getStatus()).isEqualTo(Task.Status.COMPLETED);
    }

    @Test
    void toggleStatus_switchesFromCompletedToActive() {
        task.setStatus(Task.Status.COMPLETED);
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenAnswer(inv -> inv.getArgument(0));

        TaskResponse result = taskService.toggleStatus(1L, "testuser");

        assertThat(result.getStatus()).isEqualTo(Task.Status.ACTIVE);
    }
}
