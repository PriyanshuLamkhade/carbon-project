import multer from "multer"

const storage = multer.memoryStorage();

const uploadFile = multer({ storage }).array("files", 4);

export default uploadFile