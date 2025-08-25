package com.editodo.mapper;

import com.editodo.entity.NoticePermission;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface NoticePermissionMapper {
    void save(NoticePermission permission);
    Optional<NoticePermission> findByUserId(@Param("userId") Long userId);
    List<NoticePermission> findAll();
    void deleteByUserId(@Param("userId") Long userId);
}
