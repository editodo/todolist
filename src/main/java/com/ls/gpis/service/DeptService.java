package com.ls.gpis.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

import com.ls.gpis.dao.DeptDAO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class DeptService{
    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private DeptDAO deptDAO;
    
    //부서 리스트조회
    public List<HashMap<String, Object>> selectDeptList()throws Exception{        
        return deptDAO.selectDeptList();
    }






    
}