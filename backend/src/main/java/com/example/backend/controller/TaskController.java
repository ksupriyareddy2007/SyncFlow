package com.example.backend.controller;

import com.example.backend.model.Task;
import com.example.backend.repository.TaskRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")

public class TaskController {

    private final TaskRepository repository;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    // GET ALL TASKS
    @GetMapping
    public List<Task> getTasks() {
        return repository.findAll();
    }

    // CREATE OR UPDATE TASK
    @PutMapping("/{id}")
    public ResponseEntity<?> saveTask(
            @PathVariable Long id,
            @RequestBody Task incomingTask) {

        Task existingTask = repository.findById(id).orElse(null);

        // New task
        if (existingTask == null) {

            Task newTask = new Task();

            newTask.setId(id);
            newTask.setTitle(incomingTask.getTitle());
            newTask.setCompleted(incomingTask.isCompleted());
            newTask.setUpdatedAt(incomingTask.getUpdatedAt());
            newTask.setVersion(1);

            return ResponseEntity.ok(repository.save(newTask));
        }

        // CONFLICT DETECTION
        if (incomingTask.getVersion() != existingTask.getVersion()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(existingTask);
        }

        // Update task
        existingTask.setTitle(incomingTask.getTitle());
        existingTask.setCompleted(incomingTask.isCompleted());
        existingTask.setUpdatedAt(incomingTask.getUpdatedAt());

        existingTask.setVersion(existingTask.getVersion() + 1);

        return ResponseEntity.ok(repository.save(existingTask));
    }

    // DELETE TASK
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") long version) {

        Task existingTask = repository.findById(id).orElse(null);

        if (existingTask == null) {
            return ResponseEntity.notFound().build();
        }

        // Conflict detection for delete
        if (version != existingTask.getVersion()) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(existingTask);
        }

        repository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}