package com.taskvault.backend.dto;

import com.taskvault.backend.entity.Task;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private Task.Priority priority;
    private LocalDate dueDate;
}