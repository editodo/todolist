package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class ProductInfoDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    

    //구매이력 I/F 정보를 반환한다.  
    public List<HashMap<String,Object>> selectProductInfoList(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.ProductInfo.selectProductInfoList", SearchCond);    
    }
}