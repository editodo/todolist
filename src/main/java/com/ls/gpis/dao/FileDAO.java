package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import com.ls.gpis.dto.FileDTO;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Repository
public class FileDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;

    public List<FileDTO> selectFileList(int CONTENTS_ID)throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.file.selectFileList", CONTENTS_ID);
    }

    //특정파일 정보를 가져온다.
    public FileDTO selectFile(String UUID)throws Exception{

        return (FileDTO)sqlSession.selectOne("com.ls.gpis.framework.file.selectFile", UUID);
    }

    //파일 정보를 DB에 등록 한다.
    public int insertFile(FileDTO file)throws Exception
    {        
        
        return sqlSession.insert("com.ls.gpis.framework.file.insertFile", file);
    }

    //파일 정보를 삭제 처리 한다.
    public int deleteFile(FileDTO file)throws Exception
    {
        return sqlSession.update("com.ls.gpis.framework.file.deleteFile", file);
    }

    




}