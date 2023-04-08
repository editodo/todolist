package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class BuyListDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    
    //구매집계 List의 일별 정보를 가져온다.
    public List<HashMap<String,Object>> selectBuyList_Day(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.buy_list.selectBuyList_Day", SearchCond);
    }


    //구매 집계 List의 월별 정보를 가져온다.
    public List<HashMap<String,Object>> selectBuyList_Month(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.buy_list.selectBuyList_Month", SearchCond);
    }

    //구매 집계 List의 년간 정보를 가져온다.
    public List<HashMap<String,Object>> selectBuyList_Year(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.buy_list.selectBuyList_Year", SearchCond);
    }

    //국가별 구매 이력
    public List<HashMap<String,Object>> selectBuyList_Country(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.buy_list.selectBuyList_Country", SearchCond);
    }


    //분류별 구매 집계
    public List<HashMap<String,Object>> selectBuyList_Class(HashMap<String,Object> SearchCond)throws Exception 
    {
        return sqlSession.selectList("com.ls.gpis.framework.buy_list.selectBuyList_Class", SearchCond);
    }






}