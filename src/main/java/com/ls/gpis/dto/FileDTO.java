package com.ls.gpis.dto;


public class FileDTO{

    private byte[] FILE;
    private String UUID;    
    private String FILENAME;    
    private String MIMETYPE;
    private int SIZE;


    //여기서부터 DB전용
    private int B_ID;
    private int CONTENTS_ID;
    private String DEL_FLAG;
    private String CREATER;
    private String CREATED_DATE;
    private String UPDATER;
    private String UPDATED_DATE;

    
    /**
	 * @return the fILENAME
	 */
	public String getFILENAME() {
		return FILENAME;
	}

	/**
     * @return the sIZE
     */
    public int getSIZE() {
        return SIZE;
    }

    /**
     * @param sIZE the sIZE to set
     */
    public void setSIZE(int sIZE) {
        this.SIZE = sIZE;
    }

    /**
     * @return the uPDATED_DATE
     */
    public String getUPDATED_DATE() {
        return UPDATED_DATE;
    }

    /**
     * @param uPDATED_DATE the uPDATED_DATE to set
     */
    public void setUPDATED_DATE(String uPDATED_DATE) {
        this.UPDATED_DATE = uPDATED_DATE;
    }

    /**
     * @return the uPDATER
     */
    public String getUPDATER() {
        return UPDATER;
    }

    /**
     * @param uPDATER the uPDATER to set
     */
    public void setUPDATER(String uPDATER) {
        this.UPDATER = uPDATER;
    }

    /**
     * @return the cREATED_DATE
     */
    public String getCREATED_DATE() {
        return CREATED_DATE;
    }

    /**
     * @param cREATED_DATE the cREATED_DATE to set
     */
    public void setCREATED_DATE(String cREATED_DATE) {
        this.CREATED_DATE = cREATED_DATE;
    }

    /**
     * @return the cREATER
     */
    public String getCREATER() {
        return CREATER;
    }

    /**
     * @param cREATER the cREATER to set
     */
    public void setCREATER(String cREATER) {
        this.CREATER = cREATER;
    }

    /**
     * @return the dEL_FLAG
     */
    public String getDEL_FLAG() {
        return DEL_FLAG;
    }

    /**
     * @param dEL_FLAG the dEL_FLAG to set
     */
    public void setDEL_FLAG(String dEL_FLAG) {
        this.DEL_FLAG = dEL_FLAG;
    }

    /**
     * @return the cONTENTS_ID
     */
    public int getCONTENTS_ID() {
        return CONTENTS_ID;
    }

    /**
     * @param cONTENTS_ID the cONTENTS_ID to set
     */
    public void setCONTENTS_ID(int cONTENTS_ID) {
        this.CONTENTS_ID = cONTENTS_ID;
    }

    /**
     * @return the b_ID
     */
    public int getB_ID() {
        return B_ID;
    }

    /**
     * @param b_ID the b_ID to set
     */
    public void setB_ID(int b_ID) {
        this.B_ID = b_ID;
    }

    /**
     * @return the uUID
     */
	public String getUUID() {
		return UUID;
	}

	/**
	 * @param uUID the uUID to set
	 */
	public void setUUID(String uUID) {
		this.UUID = uUID;
	}

	/**
     * @return the mIMETYPE
     */
    public String getMIMETYPE() {
        return MIMETYPE;
    }

    /**
     * @param mIMETYPE the mIMETYPE to set
     */
    public void setMIMETYPE(String mIMETYPE) {
        this.MIMETYPE = mIMETYPE;
    }

    /**
     * @return the fILE
     */
    public byte[] getFILE() {
        return FILE;
    }

    /**
     * @param fILE the fILE to set
     */
    public void setFILE(byte[] fILE) {
        this.FILE = fILE;
    }

    /**
     * @param fILENAME the fILENAME to set
     */
	public void setFILENAME(String fILENAME) {
		this.FILENAME = fILENAME;
	}







}