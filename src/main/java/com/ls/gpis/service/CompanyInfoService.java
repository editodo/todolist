package com.ls.gpis.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ls.gpis.dao.CompanyInfoDAO;
import com.ls.gpis.dto.FileDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.List;

@Service
public class CompanyInfoService{

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private CompanyInfoDAO CompanyInfoDAO;

    @Autowired
    private FileService fileService;


    //업체정보 리스트
    public List<HashMap<String, Object>> selectCompanyInfoList(HashMap<String, Object> map)throws Exception{
        
        return CompanyInfoDAO.selectCompanyInfoList(map);        
    }

    public List<HashMap<String, Object>> selectCompanyInfoListScore(HashMap<String, Object> map)throws Exception{
        
        return CompanyInfoDAO.selectCompanyInfoListScore(map);        
    }
    
    //주문법인 리스트조회
    public List<HashMap<String, Object>> coperList()throws Exception{
        
        return CompanyInfoDAO.coperList();        
    }
    

    //평가 리스트조회
    public List<HashMap<String, Object>> estimationList(HashMap<String, Object> map)throws Exception{
        
        return CompanyInfoDAO.estimationList(map);        
    }

    //평가 그래프조회
    public List<HashMap<String, Object>> estimationGraph(HashMap<String, Object> map)throws Exception{
        
        return CompanyInfoDAO.estimationGraph(map);        
    }

    

    //이슈 리스트조회
    public List<HashMap<String, Object>> selectIssueList(HashMap<String, Object> map)throws Exception{
        
        return CompanyInfoDAO.selectIssueList(map);        
    }

    //이슈 정보를 저장/수정한다.
    public int updateIssue(HashMap<String, Object> IssueInfo)
    {
        return CompanyInfoDAO.updateIssue(IssueInfo);        
    }
    
    
    //시스템 플래그 정보를 삭제한다.
    public int deleteIssue(HashMap<String, Object> deleteIssueM)
    {
        int cnt = CompanyInfoDAO.deleteIssue(deleteIssueM); 

        try
        {
              
            if(cnt == 1)    //성공
            {
                //메시지를 셋팅후 반환
                return cnt;
            }
        }
        catch(Exception ex)
        {
            logger.error(ex.getMessage());              //에러 메시지를 기록            
            return 0;
        }

        return cnt;
    }
}
