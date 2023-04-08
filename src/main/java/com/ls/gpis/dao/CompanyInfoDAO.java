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
public class CompanyInfoDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;

    public List<HashMap<String, Object>> selectCompanyInfoList(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companyInfo.selectCompanyInfoList", map);
    }

    public List<HashMap<String, Object>> selectCompanyInfoListScore(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companyInfo.selectCompanyInfoListScore", map);
    }
    

    //주문법인 리스트조회
    public List<HashMap<String, Object>> coperList() throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companyInfo.coperList");
    }
    
    //업체평가 리스트조회
    public List<HashMap<String, Object>> estimationList(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companyInfo.estimationList",map);
    }

    
    //업체평가 그래프조회
    public List<HashMap<String, Object>> estimationGraph(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companyInfo.estimationGraph",map);
    }

    //이슈 리스트조회
    public List<HashMap<String, Object>> selectIssueList(HashMap<String, Object>  map) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.companyInfo.selectIssueList",map);
    }

    //이슈 정보를 추가/갱신 한다
    public int updateIssue(HashMap<String,Object> IssueInfo){
        
        return sqlSession.update("com.ls.gpis.framework.companyInfo.updateIssue", IssueInfo);
    }

    public int deleteIssue(HashMap<String,Object> IssueInfo){
        
        return sqlSession.update("com.ls.gpis.framework.companyInfo.deleteIssue", IssueInfo);
    }
    
}
