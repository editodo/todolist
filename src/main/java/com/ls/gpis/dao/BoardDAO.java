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
public class BoardDAO{

    Logger logger = LoggerFactory.getLogger(this.getClass());   

    @Autowired
    protected SqlSessionTemplate sqlSession;
    
    //게시물 리스트조회
    public List<HashMap<String, Object>> selectBoardList(int Bid) throws Exception{
        
        return sqlSession.selectList("com.ls.gpis.framework.board.selectBoardList", Bid);
    }

    //댓글 리스트 조회
    public List<HashMap<String, Object>> selectBoardCommentList(int B_ID, int OWNER_ID) throws Exception{

        HashMap<String, Object> SearchCond = new HashMap<String, Object>();
        SearchCond.put("OWNER_ID", OWNER_ID);
        SearchCond.put("B_ID", B_ID);

        return sqlSession.selectList("com.ls.gpis.framework.board.selectBoardCommentList", SearchCond);
    }


    //게시물 등록
    //Return CONTENTS_ID
    public int insertBoardContents(HashMap<String, Object> Contnets, int B_ID) throws Exception
    {
        Contnets.put("B_ID", B_ID);
        
        if(sqlSession.insert("com.ls.gpis.framework.board.insertBoardContents", Contnets) == 1)
        {
            return Integer.parseInt(Contnets.get("CONTENTS_ID").toString());    //성공했을경우 CONTENTS_ID를 반환한다.
        }

        return -1;  //실패했을경우 CONTENTS_ID에 -1로 반환한다.
    }

    //댓글 등록
    public int insertBoardComment(HashMap<String, Object> Contents, int B_ID) throws Exception
    {
        Contents.put("B_ID", B_ID);
        
        if(sqlSession.insert("com.ls.gpis.framework.board.insertBoardComment", Contents) == 1)
        {
            return Integer.parseInt(Contents.get("CONTENTS_ID").toString());    //성공했을경우 CONTENTS_ID를 반환한다.
        }

        return -1;  //실패했을경우 CONTENTS_ID에 -1로 반환한다.
    }



    //게시물을 반환한다.
    public HashMap<String, Object> selectBoardContents(int CONTENTS_ID, int B_ID)throws Exception
    {       
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("CONTENTS_ID", CONTENTS_ID);
        map.put("B_ID", B_ID);
        return sqlSession.selectOne("com.ls.gpis.framework.board.selectBoardContents", map);
    }

    //게시물 정보를 수정한다.
    public int updateBoardContents(HashMap<String, Object> ContentsInfo){
        
        return sqlSession.update("com.ls.gpis.framework.board.updateBoardContents", ContentsInfo);
    }

    //코멘트 정보를 수정한다.
    public int updateBoardComment(HashMap<String, Object> ContentsInfo){
        
        return sqlSession.update("com.ls.gpis.framework.board.updateBoardComment", ContentsInfo);
    }


    

    
    //게시물 조회수 카운터 +1
    public int updateBoardContentsCountUp(int CONTENTS_ID, int B_ID){

        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("CONTENTS_ID", CONTENTS_ID);
        map.put("B_ID", B_ID);

        return sqlSession.update("com.ls.gpis.framework.board.updateBoardContentsCountUp", map);
    }


    //게시물을 삭제 한다.
    public int deleteBoardContents(int CONTENTS_ID, int B_ID)
    {
        HashMap<String, Object> map = new HashMap<String, Object>();
        map.put("CONTENTS_ID", CONTENTS_ID);
        map.put("B_ID", B_ID);

        return sqlSession.update("com.ls.gpis.framework.board.deleteBoardContents", map);
    }


}
