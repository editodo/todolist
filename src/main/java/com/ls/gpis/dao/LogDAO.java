package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class LogDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    
    //로그정보를 반환한다.
    public List<HashMap<String,Object>> selectLogInfo(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.log.selectLogInfo", SearchCond);
    }

    //오류로그 리스트를 반환한다.
    public List<HashMap<String,Object>> selectErrLogList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.log.selectErrLogList", SearchCond);
    }

    //에러 로그 정보를 DB에다가 저장한다.
    public int insertErrorLog(HashMap<String, Object> errorLogData)throws Exception {

        return sqlSession.insert("com.ls.gpis.framework.log.insertErrorLog", errorLogData);
    }

    //사용 로그 정보를 DB에다가 저장한다.
    public int insertUseLog(HashMap<String, Object> useLogData)throws Exception {

        return sqlSession.insert("com.ls.gpis.framework.log.insertUseLog", useLogData);
    }

    //사용자 로그인 정보를 DB에다가 저장한다.
    public int insertUseLoginLog(HashMap<String, Object> useLogData)throws Exception {
        
        return sqlSession.insert("com.ls.gpis.framework.log.insertUseLoginLog", useLogData);
    }

    //로그인 정보를 반환한다.
    public List<HashMap<String,Object>> selectUseLoginLog(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.log.selectUseLoginLog", SearchCond);
    }


}