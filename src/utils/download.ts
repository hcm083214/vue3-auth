type fileType = 'application/vnd.ms-excel' | 'application/msword' | 'application/zip' | 'text/html' | 'text/markdown'
const download = (data: any, fileName: string, mineType: fileType) => {
    // 创建 blob
    const blob = new Blob([data], { type: mineType });
    console.log("🚀 ~ file: download.ts:5 ~ download ~ blob:", blob)
    const downloadUrl = URL.createObjectURL(blob);
    // 为了构建如下元素：<a href=downloadUrl download=fileName>下载</a>
    const a = document.createElement('a');
    a.download = fileName;
    a.href = downloadUrl;

    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(downloadUrl);
}
// 下载 Excel 方法
export function excel(data: any, fileName: string) {
    download(data, fileName, 'application/vnd.ms-excel');
}