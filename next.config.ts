const nextConfig = {
  output: 'export',  // 정적 HTML로 export
  basePath: '',  // GitHub Pages 사용자 페이지의 경우 비워둠
  images: {
    unoptimized: true,  // GitHub Pages는 이미지 최적화 미지원
  },
};