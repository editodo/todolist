package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class WorkPlaceDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;


    //사업장 정보를 추가/갱신 한다
    public int updateWorkPlace(HashMap<String,Object> WorkPlaceInfo){
        
        return sqlSession.update("com.ls.gpis.framework.workplace.updateWorkPlace", WorkPlaceInfo);
    }

    //검색조건에 맞는 사업장 리스트를 반환한다.
    public List<HashMap<String, Object>> selectWorkPlaceList(HashMap<String, Object> SearchCond){
        return sqlSession.selectList("com.ls.gpis.framework.workplace.selectWorkPlaceList", SearchCond);        
    }

    //사업장 정보를 가져온다.
    public HashMap<String, Object> selectWorkPlaceInfo(HashMap<String, Object> SearchCond){
                      
        return sqlSession.selectOne("com.ls.gpis.framework.workplace.selectWorkPlace", SearchCond);
    }


}