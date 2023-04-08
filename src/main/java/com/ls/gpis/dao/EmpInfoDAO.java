package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class EmpInfoDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    

    //구매조직현황 조회.  
    public List<HashMap<String,Object>> selectEmpInfoList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.EmpInfo.selectEmpInfoList", SearchCond);    
    }
}