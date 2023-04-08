package com.ls.gpis.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ls.gpis.dao.CompanyBuyDAO;
import com.ls.gpis.dto.FileDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.List;

@Service
public class CompanyBuyService{

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private CompanyBuyDAO companyBuyDAO;

    @Autowired
    private FileService fileService;



    //구매이력 리스트조회
    public List<HashMap<String, Object>> selectCompanyBuyList(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.selectCompanyBuyList(map);        
    }

    //업체별 구매이력 리스트
    public List<HashMap<String, Object>> selectCompanyBuyCompanyList(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.selectCompanyBuyCompanyList(map);        
    }

    //업체정보 리스트
    public List<HashMap<String, Object>> selectCompanyInfoList(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.selectCompanyInfoList(map);        
    }
    //주문법인 리스트조회
    public List<HashMap<String, Object>> coperList()throws Exception{
        
        return companyBuyDAO.coperList();        
    }
    
    //주문사업장 리스트조회
    public List<HashMap<String, Object>> workplaceList(String coper)throws Exception{
        
        return companyBuyDAO.workplaceList(coper);        
    }

    //주문사업장 리스트조회
    public List<HashMap<String, Object>> countryList()throws Exception{
        
        return companyBuyDAO.countryList();        
    }
    
    //중분류 리스트조회
    public List<HashMap<String, Object>> product_group_list(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.product_group_list(map);        
    }
    //중분류 리스트조회(전체 없는 버전)
    public List<HashMap<String, Object>> product_group_list2(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.product_group_list2(map);        
    }

    //대분류 리스트조회
    public List<HashMap<String, Object>> product_class_list(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.product_class_list(map);        
    }

    public List<HashMap<String, Object>> product_subclass_list(HashMap<String, Object> map)throws Exception{
        
        return companyBuyDAO.product_subclass_list(map);        
    }

}
