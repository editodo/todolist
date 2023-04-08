package com.ls.gpis.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import java.util.*;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
public class DeptDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;

    //IF테이블을 부서정보를 가져온다.(작성중)
    public List<HashMap<String, Object>> selectHRDeptList(String yyyymmdd){

        return sqlSession.selectList("com.ls.gpis.framework.dept.selectHRDeptList", yyyymmdd);        

    }
    
    //인사시스템에 존재하지 않는 부서정보는 Disable로 처리
    public int syncDisableDept(String yyyymmdd){

        return sqlSession.update("com.ls.gpis.framework.dept.syncDisableDept", yyyymmdd);
    }

    //부서정보를 추가/갱신 처리 한다.
    public int updateDeptList(HashMap<String,Object> deptInfo){
        return sqlSession.update("com.ls.gpis.framework.dept.updateDeptList", deptInfo);
    }

    //활성화된 부서리스트를 반환한다.
    public List<HashMap<String, Object>> selectDeptList(){
        return sqlSession.selectList("com.ls.gpis.framework.dept.selectDeptList");        
    }
}