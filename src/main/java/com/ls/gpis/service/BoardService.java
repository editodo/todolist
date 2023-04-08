package com.ls.gpis.service;

import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ls.gpis.dao.BoardDAO;
import com.ls.gpis.dto.CommonDTO;
import com.ls.gpis.dto.FileDTO;
import com.ls.gpis.util.CommonUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

@Service
public class BoardService{

    Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private BoardDAO boardDAO;

    @Autowired
    private FileService fileService;

    @Autowired
    private LogService logService;


    //게시물 리스트조회
    public List<HashMap<String, Object>> selectBoardList(int Bid)throws Exception{
        
        return boardDAO.selectBoardList(Bid);        
    }

    //댓글 리스트조회
    public List<HashMap<String, Object>> selectBoardCommentList(int B_ID, int OWNER_ID)throws Exception{
        
        return boardDAO.selectBoardCommentList(B_ID, OWNER_ID);        
    }

    //게시물 등록
    public int insertBoardContents(HashMap<String, Object> Contents, int B_ID) throws Exception
    {
        return boardDAO.insertBoardContents(Contents, B_ID);
    }

    //게시물 등록(첨부파일 포함된 게시물)
    @Transactional
    public int insertBoardContesntsFile(HashMap<String, Object> Contents, 
                                        int B_ID,
                                        MultipartFile[] files                                 
                                        ) throws Exception
    {
        int CONTENTS_ID = boardDAO.insertBoardContents(Contents, B_ID);

        String Creater = Contents.get("CREATER").toString();    //작성자ID
        
        for(int i = 0 ; i < files.length; i++)
        {
            FileDTO fd = new FileDTO();
            String mimeType = files[i].getContentType();
            String filename = files[i].getOriginalFilename();
            byte[] bytes = files[i].getBytes();

            fd.setSIZE(bytes.length);
            fd.setB_ID(B_ID);
            fd.setFILE(bytes);
            fd.setFILENAME(filename);
            fd.setMIMETYPE(mimeType);
            fd.setCONTENTS_ID(CONTENTS_ID);
            fd.setCREATER(Creater);

            fileService.uploadFile(fd);
        }

        return 0;
    }


    //게시물 반환.
    @Transactional
    public HashMap<String, Object> selectBoardContents(int CONTENTS_ID, int B_ID)throws Exception
    {
        boardDAO.updateBoardContentsCountUp(CONTENTS_ID, B_ID); //조회수 카운터 up
        HashMap<String, Object> ret = boardDAO.selectBoardContents(CONTENTS_ID, B_ID);        
        ret.put("FILES", fileService.selectFileList(CONTENTS_ID));  //파일리스트를 가져온다.

        return ret;        
    }    


    //댓글 등록
    public CommonDTO insertBoardComment(HttpServletRequest request,
                                        HashMap<String, Object> CommentInfo,                                            
                                        int B_ID)throws Exception
    {

        try
        {

            String UserID = request.getAttribute("UserID").toString();  //접속 토큰의 사용자 정보

            CommentInfo.put("CREATER", UserID); //등록자 추가

            int ret = boardDAO.insertBoardComment(CommentInfo, B_ID);

            if(ret != -1)
            {
                return new CommonDTO(true, "등록 되었습니다.");
            }
        }
        catch (Exception e)
        {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }

        return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");


    }



    //게시물을 삭제 처리한다.
    public CommonDTO deleteBoardContents(HttpServletRequest request,
                                        HashMap<String, Object> ContentsInfo,
                                        int CONTENTS_ID, 
                                        int B_ID)throws Exception
    {
        try
        {
            String UserID = request.getAttribute("UserID").toString();  //접속 토큰의 사용자 정보

            //게시물의 작성자와 현제 사용자가 동일한지 확인한다.
            HashMap<String, Object> CurrentBoardContents = boardDAO.selectBoardContents(CONTENTS_ID, B_ID);
            if(CurrentBoardContents == null)
            {
                return new CommonDTO(false, "게시물 정보를 확인 할 수 없습니다.");            
            }

            String ContentsUserID = CurrentBoardContents.get("CREATER").toString(); //DB에 저장되어 있는 게시물의 작성자정보를 가져온다.
            if(CommonUtil.isNullOrEmpty(ContentsUserID))
            {
                return new CommonDTO(false, "작성자 정보를 확인 할 수 없습니다.");
            }

            if(!UserID.equals(ContentsUserID))
            {
                return new CommonDTO(false, "본인이 작성한 게시물만 삭제 할 수 있습니다.");
            }

            int ret = boardDAO.deleteBoardContents(CONTENTS_ID, B_ID);
            if(ret == 1)
            {
                return new CommonDTO(true, "삭제 되었습니다.");
            }

            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
        catch (Exception e)
        {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }

    }

 

    //게시물을 수정 처리 한다.
    public CommonDTO updateBoardContents(HttpServletRequest request,
                                         HashMap<String, Object> ContentsInfo,
                                         int CONTENTS_ID, 
                                        int B_ID)throws Exception
    {
        try
        {

            String UserID = request.getAttribute("UserID").toString();  //접속 토큰의 사용자 정보

            //게시물의 작성자와 현제 사용자가 동일한지 확인한다.
            HashMap<String, Object> CurrentBoardContents = boardDAO.selectBoardContents(CONTENTS_ID, B_ID);
            if(CurrentBoardContents == null)
            {
                return new CommonDTO(false, "게시물 정보를 확인 할 수 없습니다.");            
            }

            String ContentsUserID = CurrentBoardContents.get("CREATER").toString(); //DB에 저장되어 있는 게시물의 작성자정보를 가져온다.
            if(CommonUtil.isNullOrEmpty(ContentsUserID))
            {
                return new CommonDTO(false, "작성자 정보를 확인 할 수 없습니다.");
            }

            if(!UserID.equals(ContentsUserID))
            {
                return new CommonDTO(false, "본인이 작성한 게시물만 수정 할 수 있습니다.");
            }


            ContentsInfo.put("CONTENTS_ID", CONTENTS_ID);
            ContentsInfo.put("B_ID", B_ID);
            ContentsInfo.put("UPDATER", UserID);


            int ret = boardDAO.updateBoardContents(ContentsInfo);
            if(ret == 1)
            {
                return new CommonDTO(true, "수정 되었습니다.");
            }

            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");

        }
        catch (Exception e)
        {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }


    //코멘트를 수정 처리 한다.
    public CommonDTO updateBoardComment(HttpServletRequest request,
                                         HashMap<String, Object> ContentsInfo,
                                         int CONTENTS_ID, 
                                        int B_ID)throws Exception
    {
        try
        {

            String UserID = request.getAttribute("UserID").toString();  //접속 토큰의 사용자 정보

            //게시물의 작성자와 현제 사용자가 동일한지 확인한다.
            HashMap<String, Object> CurrentBoardContents = boardDAO.selectBoardContents(CONTENTS_ID, B_ID);
            if(CurrentBoardContents == null)
            {
                return new CommonDTO(false, "게시물 정보를 확인 할 수 없습니다.");            
            }

            String ContentsUserID = CurrentBoardContents.get("CREATER").toString(); //DB에 저장되어 있는 게시물의 작성자정보를 가져온다.
            if(CommonUtil.isNullOrEmpty(ContentsUserID))
            {
                return new CommonDTO(false, "작성자 정보를 확인 할 수 없습니다.");
            }

            if(!UserID.equals(ContentsUserID))
            {
                return new CommonDTO(false, "본인이 작성한 게시물만 수정 할 수 있습니다.");
            }


            ContentsInfo.put("CONTENTS_ID", CONTENTS_ID);
            ContentsInfo.put("B_ID", B_ID);
            ContentsInfo.put("UPDATER", UserID);


            int ret = boardDAO.updateBoardComment(ContentsInfo);
            if(ret == 1)
            {
                return new CommonDTO(true, "수정 되었습니다.");
            }

            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");

        }
        catch (Exception e)
        {
            logService.insertErrorLog(request, e);            
            return new CommonDTO(false, "오류(관리자에게 문의 하십시요.)");
        }
    }


    

}
