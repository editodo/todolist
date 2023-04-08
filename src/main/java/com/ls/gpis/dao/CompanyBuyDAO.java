package com.ls.gpis.dao;

import java.util.HashMap;
import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

//게시물 관련 정보에 대한 DAO
@Repository
public class CompanyBuyDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    
    //게시물 리스트조회
    public List<HashMap<String, Object>> selectCompanyBuyList(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.selectCompanyBuyList", map);
    }


    public List<HashMap<String, Object>> selectCompanyBuyCompanyList(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.selectCompanyBuyCompanyList", map);
    }

    public List<HashMap<String, Object>> selectCompanyInfoList(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.selectCompanyInfoList", map);
    }

    //주문법인 리스트조회
    public List<HashMap<String, Object>> coperList() throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.coperList");
    }
    
    //주문사업장 리스트조회
    public List<HashMap<String, Object>> workplaceList(String coper) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.workplaceList",coper);
    }

    //국가 리스트조회
    public List<HashMap<String, Object>> countryList() throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.countryList");
    }

    //중분류 리스트조회
    public List<HashMap<String, Object>> product_group_list(HashMap<String, Object> map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.product_group_list", map);
    }
    
    //중분류 리스트조회(중분류 전체 없는 버전)
    public List<HashMap<String, Object>> product_group_list2(HashMap<String, Object> map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.product_group_list2", map);
    }

    //대분류 리스트조회
    public List<HashMap<String, Object>> product_class_list(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.product_class_list",map);
    }

    public List<HashMap<String, Object>> product_subclass_list(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companybuy.product_subclass_list", map);
    }
}
