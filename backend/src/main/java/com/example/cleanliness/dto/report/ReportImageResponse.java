package com.example.cleanliness.dto.report;

import java.time.LocalDateTime;

public class ReportImageResponse {

    private Long id;
    private String fileName;
    private String filePath;
    private String url;
    private String fileType;
    private Long fileSize;
    private LocalDateTime createdAt;

    public ReportImageResponse() {
    }

    public ReportImageResponse(Long id, String fileName, String filePath, String url, String fileType, Long fileSize, LocalDateTime createdAt) {
        this.id = id;
        this.fileName = fileName;
        this.filePath = filePath;
        this.url = url;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getUrl() {
        return url != null ? url : filePath;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
