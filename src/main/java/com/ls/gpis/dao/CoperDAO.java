package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class CoperDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;


    //사용자 정보를 추가/갱신 한다
    public int updateCoper(HashMap<String,Object> CoperInfo){
        
        return sqlSession.update("com.ls.gpis.framework.coper.updateCoper", CoperInfo);
    }

    //검색조건에 맞는 법인 리스트를 반환한다.
    public List<HashMap<String, Object>> selectCoperList(HashMap<String, Object> SearchCond){
        return sqlSession.selectList("com.ls.gpis.framework.coper.selectCoperList", SearchCond);        
    }

    //사용자 정보를 가져온다.
    public HashMap<String, Object> selectCoperInfo(HashMap<String, Object> SearchCond){
                      
        return sqlSession.selectOne("com.ls.gpis.framework.coper.selectCoper", SearchCond);
    }


}