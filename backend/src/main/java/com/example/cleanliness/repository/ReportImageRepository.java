package com.example.cleanliness.repository;

import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportImageRepository extends JpaRepository<ReportImage, Long> {

    List<ReportImage> findByReport(Report report);
}
