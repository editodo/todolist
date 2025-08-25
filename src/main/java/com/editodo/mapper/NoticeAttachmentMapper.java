package com.editodo.mapper;

import com.editodo.entity.NoticeAttachment;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface NoticeAttachmentMapper {
    void save(NoticeAttachment attachment);
    Optional<NoticeAttachment> findById(@Param("attachmentId") Long attachmentId);
    List<NoticeAttachment> findByNoticeId(@Param("noticeId") Long noticeId);
    void deleteById(@Param("attachmentId") Long attachmentId);
    void deleteByNoticeId(@Param("noticeId") Long noticeId);
}
