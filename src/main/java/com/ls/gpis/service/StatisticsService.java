package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ls.gpis.dao.BuyListDAO;

import java.util.HashMap;
import java.util.List;



@Service
public class StatisticsService {

    @Autowired
    private BuyListDAO buyListDAO;

    //구매집계 List의 일별 정보를 가져온다.
    public List<HashMap<String,Object>> selectBuyList_Day(HashMap<String,Object> SearchCond) throws Exception
    {
        return buyListDAO.selectBuyList_Day(SearchCond);
    }

    //구매 집계 List의 월별 정보를 가져온다.
    public List<HashMap<String,Object>> selectBuyList_Month(HashMap<String,Object> SearchCond) throws Exception
    {
        return buyListDAO.selectBuyList_Month(SearchCond);
    }    

     //구매 집계 List의 년간 정보를 가져온다.
    public List<HashMap<String,Object>> selectBuyList_Year(HashMap<String,Object> SearchCond) throws Exception
    {
        return buyListDAO.selectBuyList_Year(SearchCond);
    }    

     //국가별 구매 이력
     public List<HashMap<String,Object>> selectBuyList_Country(HashMap<String,Object> SearchCond) throws Exception
    {
        return buyListDAO.selectBuyList_Country(SearchCond);
    }    

    //분류별 구매 집계
    public List<HashMap<String,Object>> selectBuyList_Class(HashMap<String,Object> SearchCond) throws Exception
    {
        return buyListDAO.selectBuyList_Class(SearchCond);
    }    
   
}

