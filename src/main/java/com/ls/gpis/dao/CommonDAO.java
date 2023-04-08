package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;



import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//공통 DAO
@Repository
public class CommonDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    
    //시퀀스 값을 가져온다.
    public int selectGetSEQ(String SeqName)throws Exception 
    {
        
        return sqlSession.selectOne("com.ls.gpis.framework.common.selectGetSEQ", SeqName);
    }



}