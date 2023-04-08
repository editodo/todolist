package com.ls.gpis.dao;

import org.springframework.stereotype.Repository;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;

import com.ls.gpis.dto.CodeDTO;
import com.ls.gpis.dto.DetailCodeDTO;

import org.mybatis.spring.SqlSessionTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Repository
public class CodeDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired 
    protected SqlSessionTemplate sqlSession;

    //신규 메뉴정보를 등록한다
   public int insertCode(final CodeDTO codeItem) throws Exception {
    return sqlSession.insert("com.ls.gpis.framework.code.insertCode", codeItem);
  }

  public int insertDetailCode(final DetailCodeDTO codeItem) throws Exception {
    return sqlSession.insert("com.ls.gpis.framework.code.insertDetailCode", codeItem);
  }
  
  // 결재정보를 수정한다.
  public int updateCode(final CodeDTO codeItem) throws Exception {
    return sqlSession.update("com.ls.gpis.framework.code.updateCode", codeItem);
  }

   // 결재자정보를 수정한다.
   public int updateDetailCode(final DetailCodeDTO codeItem) throws Exception {
    return sqlSession.update("com.ls.gpis.framework.code.updateDetailCode", codeItem);
  }

  
  // 결재정보를 삭제한다.
  public int deleteCode(final String groupCode) throws Exception {
    return sqlSession.delete("com.ls.gpis.framework.code.deleteCode", groupCode);
  }

   // 결재자정보를 삭제한다.
   public int deleteDetailCode(final DetailCodeDTO code) throws Exception {
    return sqlSession.delete("com.ls.gpis.framework.code.deleteDetailCode", code);
  }

  
   // 결재자 전체를 삭제한다.
   public int deleteDetailCodeList(final String groupCode) throws Exception {
    return sqlSession.delete("com.ls.gpis.framework.code.deleteDetailCodeList", groupCode);
  }

  // 결재 리스트를 반환한다.
  public List<CodeDTO> selectCodeList(String groupCode) throws Exception {
    return sqlSession.selectList("com.ls.gpis.framework.code.selectCodeList", groupCode);
  }

   // 결재자 리스트를 반환한다.
   public List<CodeDTO>  selectDetailCodeList( DetailCodeDTO code) throws Exception {
    return sqlSession.selectList("com.ls.gpis.framework.code.selectDetailCodeList", code);
  } 
}