package com.taskvault.backend.dto;

import com.taskvault.backend.entity.Task;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.Priority priority;
    private Task.Status status;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
}