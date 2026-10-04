package com.example.cleanliness.repository;

import com.example.cleanliness.entity.Report;
import com.example.cleanliness.entity.ReportStatus;
import com.example.cleanliness.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    Page<Report> findByReporter(User reporter, Pageable pageable);

    Page<Report> findByReporterAndStatus(User reporter, ReportStatus status, Pageable pageable);

    @Query("SELECT r FROM Report r WHERE r.reporter = :reporter AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:search IS NULL OR LOWER(COALESCE(r.location, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.building, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.room, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.description, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.title, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Report> findByReporterWithFilter(@Param("reporter") User reporter,
                                          @Param("status") ReportStatus status,
                                          @Param("search") String search,
                                          Pageable pageable);

    Page<Report> findByStatus(ReportStatus status, Pageable pageable);

    Page<Report> findByStatusIn(Collection<ReportStatus> statuses, Pageable pageable);

    @Query("SELECT r FROM Report r WHERE r.status IN :statuses AND " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:search IS NULL OR LOWER(COALESCE(r.location, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.building, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.room, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.description, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.title, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Report> findStaffReportsWithFilter(@Param("statuses") Collection<ReportStatus> statuses,
                                           @Param("status") ReportStatus status,
                                           @Param("search") String search,
                                           Pageable pageable);

    @Query("SELECT r FROM Report r WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:search IS NULL OR LOWER(COALESCE(r.location, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.building, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.room, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.description, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(COALESCE(r.title, '')) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) OR LOWER(r.reporter.fullName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    Page<Report> findAdminReportsWithFilter(@Param("status") ReportStatus status,
                                           @Param("search") String search,
                                           Pageable pageable);

    long countByStatus(ReportStatus status);

    long countByReporter(User reporter);

    long countByReporterAndStatus(User reporter, ReportStatus status);

    long countByStatusIn(Collection<ReportStatus> statuses);

    List<Report> findTop5ByOrderByCreatedAtDesc();

    List<Report> findTop5ByReporterOrderByCreatedAtDesc(User reporter);
}
