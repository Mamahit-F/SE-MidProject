package com.example.cleanliness.dto.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

public class ReportCreateRequest {

    private String title;

    private String building;

    @Size(max = 150, message = "Ruangan / Lokasi Spesifik maksimal 150 karakter")
    private String room;

    private String location;

    private String category;

    @NotBlank(message = "Keterangan atau deskripsi masalah wajib diisi")
    private String description;

    private String urgency = "MEDIUM";

    private MultipartFile image;

    private String imageUrl;

    public ReportCreateRequest() {
    }

    public ReportCreateRequest(String location, String description) {
        this.location = location;
        this.description = description;
    }

    public ReportCreateRequest(String building, String room, String description) {
        this.building = building;
        this.room = room;
        this.description = description;
    }

    public String getTitle() {
        if (title != null && !title.trim().isEmpty()) {
            return title.trim();
        }
        String effectiveLoc = room != null && !room.trim().isEmpty() ? room.trim() : (location != null ? location.trim() : "Lokasi");
        if (category != null && !category.trim().isEmpty()) {
            return category + " di " + effectiveLoc;
        }
        return "Laporan Kebersihan di " + effectiveLoc;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBuilding() {
        return building;
    }

    public void setBuilding(String building) {
        this.building = building;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
