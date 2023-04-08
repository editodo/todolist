package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ls.gpis.dao.CommonDAO;
import com.ls.gpis.dao.InterfaceDAO;
import com.ls.gpis.dao.SystemFlagDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.util.CommonUtil;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class InterfaceService {

    Logger logger = LoggerFactory.getLogger(this.getClass());   

     @Autowired
     private InterfaceDAO interfaceDAO;
    
    // @Autowired
    // private CommonDAO commonDAO;

    // @Autowired
    // private LogService logService;

    //구매이력 I/F 정보를 반환한다.  
    public List<HashMap<String,Object>> selectBuyList(HashMap<String,Object> SearchCond) throws Exception
    {
        return interfaceDAO.selectBuyList(SearchCond);        
    }

    //업체정보 I/F를 반환한다. 
    public List<HashMap<String,Object>> selectCompanyList(HashMap<String,Object> SearchCond) throws Exception
    {
        return interfaceDAO.selectCompanyList(SearchCond);        
    }


    //업체평가정보 I/F를 반환한다.
    public List<HashMap<String,Object>> selectCompanyEstimationList(HashMap<String,Object> SearchCond) throws Exception
    {
        return interfaceDAO.selectCompanyEstimationList(SearchCond);        
    }

}

