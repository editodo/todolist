package com.ls.gpis.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import com.ls.gpis.dao.FileDAO;
import com.ls.gpis.dto.FileDTO;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

//파일 서비스 클래스
@Service
public class FileService{

    @Autowired
    private FileDAO filedao;
    
    protected Log log = LogFactory.getLog(this.getClass());
    
    //프로퍼티로 파일저장용 폴더를 지정함(설정 파일인 application.properties 참조)
    @Value("${file.upload.directory}")
    private String FILE_FOLDER;

    //파일을 저장한다.
    public FileDTO uploadFile(FileDTO file) throws Exception
    {        
        FileDTO ret = new FileDTO();    //결과 저장용

        String uuid = UUID.randomUUID().toString();
        file.setUUID(uuid);

        Path path = Paths.get(FILE_FOLDER + uuid);
        Files.write(path, file.getFILE()); // HDD에 파일 저장

        file.setFILE(null);
        filedao.insertFile(file);            //DB에 파일정보 저장

        ret.setUUID(uuid);

        return ret;
    }

    //파일리스트를 반환한다.
    public List<FileDTO> selectFileList(int CONTENTS_ID)throws Exception{        
        return filedao.selectFileList(CONTENTS_ID);
    }

    //특정파일 정보를 반환한다.
    public FileDTO selectFile(String UUID)throws Exception{
        FileDTO ret = filedao.selectFile(UUID);

        //하드디스크에 저장되어 있는 파일정보
        Path path = Paths.get(FILE_FOLDER + UUID);
        ret.setFILE(Files.readAllBytes(path));      
        
        return ret;
    }

    //실제 파일을 반환 한다.
    public byte[] getFile(String UUID)throws Exception {

        Path path = Paths.get(FILE_FOLDER + UUID);
        return Files.readAllBytes(path);
    }

    //파일 정보를 삭제 처리 한다.
    public int deleteFile(FileDTO file)throws Exception{
        return filedao.deleteFile(file);
    }

}