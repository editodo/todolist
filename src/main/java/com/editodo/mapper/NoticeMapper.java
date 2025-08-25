package com.editodo.mapper;

import com.editodo.entity.Notice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface NoticeMapper {
    void save(Notice notice);
    Optional<Notice> findById(@Param("noticeId") Long noticeId);
    List<Notice> findAllOrderByNoticeAndCreatedAtDesc();
    List<Notice> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    void update(Notice notice);
    void deleteById(@Param("noticeId") Long noticeId);
    void incrementViewCount(@Param("noticeId") Long noticeId);
}
