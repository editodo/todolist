package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class InterfaceDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    

    //구매이력 I/F 정보를 반환한다.  
    public List<HashMap<String,Object>> selectBuyList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.interface.selectBuyList", SearchCond);    
    }

    //업체정보 I/F를 반환한다. 
    public List<HashMap<String,Object>> selectCompanyList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.interface.selectCompanyList", SearchCond);    
    }

    //업체평가정보 I/F를 반환한다.
    public List<HashMap<String,Object>> selectCompanyEstimationList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.interface.selectCompanyEstimationList", SearchCond);    
    }

}