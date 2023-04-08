package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import com.ls.gpis.dao.CoperDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.util.SHA256Util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CoperService{
    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    private CoperDAO coperDAO;        //사용자 정보 DAO


    //사용자 리스트를 반환한다.
    public List<HashMap<String,Object>> selectCoperList(HashMap<String, Object> CoperInfo)
    {
        return coperDAO.selectCoperList(CoperInfo);
    }

    //사용자가 리스트에 존재 하는지 확인
    public Boolean checkCoperInfo(HashMap<String, Object> CoperInfo)
    {
        if(coperDAO.selectCoperInfo(CoperInfo) == null) return false;

        return true;
    }

    //법인 정보를 저장/수정한다.
    public int updateCoper(HashMap<String, Object> CoperInfo)
    {
        return coperDAO.updateCoper(CoperInfo);        
    }
    

    

}