package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import com.ls.gpis.dao.WorkPlaceDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.util.SHA256Util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class WorkPlaceService{
    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    private WorkPlaceDAO workPlaceDAO;        //사업장 정보 DAO


    //사업장 리스트를 반환한다.
    public List<HashMap<String,Object>> selectWorkPlaceList(HashMap<String, Object> WorkPlaceInfo)
    {
        return workPlaceDAO.selectWorkPlaceList(WorkPlaceInfo);
    }

    //사업장 리스트에 존재 하는지 확인
    public Boolean checkWorkPlaceInfo(HashMap<String, Object> WorkPlaceInfo)
    {
        if(workPlaceDAO.selectWorkPlaceInfo(WorkPlaceInfo) == null) return false;

        return true;
    }

    //사업장 정보를 저장/수정한다.
    public int updateWorkPlace(HashMap<String, Object> WorkPlaceInfo)
    {
        return workPlaceDAO.updateWorkPlace(WorkPlaceInfo);        
    }
    

    

}