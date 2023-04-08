package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ls.gpis.dao.CommonDAO;
import com.ls.gpis.dao.EmpInfoDAO;
import com.ls.gpis.dao.SystemFlagDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.util.CommonUtil;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class EmpInfoService {

    Logger logger = LoggerFactory.getLogger(this.getClass());   

     @Autowired
     private EmpInfoDAO EmpInfoDAO;
    
    // @Autowired
    // private CommonDAO commonDAO;

    // @Autowired
    // private LogService logService;

    //정보를 반환한다.  
    public List<HashMap<String,Object>> selectEmpInfo(HashMap<String,Object> SearchCond) throws Exception
    {
        return EmpInfoDAO.selectEmpInfoList(SearchCond);        
    }    
}

