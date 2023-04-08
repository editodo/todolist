package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class HomeDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;


    //검색조건에 맞는 라스트 업데이트를 반환한다.
    public List<HashMap<String, Object>> selectLastDate(){
        return sqlSession.selectList("com.ls.gpis.framework.home.selectLastDate");        
    }

    public List<HashMap<String, Object>> selectCoperMoneyList(){
        return sqlSession.selectList("com.ls.gpis.framework.home.selectCoperMoneyList");        
    }
    
    public List<HashMap<String, Object>> selectWorkPlaceMoneyList(){
        return sqlSession.selectList("com.ls.gpis.framework.home.selectWorkPlaceMoneyList");        
    }

    public List<HashMap<String, Object>> selectyearTotalCompany(){
        return sqlSession.selectList("com.ls.gpis.framework.home.selectyearTotalCompany");        
    }

    public List<HashMap<String, Object>> selectyearTotalMoney(){
        return sqlSession.selectList("com.ls.gpis.framework.home.selectyearTotalMoney");        
    }
    //사용자 정보를 가져온다.
    // public HashMap<String, Object> selectCoperInfo(HashMap<String, Object> SearchCond){
                      
    //     return sqlSession.selectOne("com.ls.gpis.framework.coper.selectCoper", SearchCond);
    // }


}