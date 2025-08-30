# 🏔️ Whistler Mountain Biking Guide

캐나다 휘슬러 마운틴 바이킹 완벽 가이드 - Next.js + Supabase

## 🚀 프로젝트 개요

이 프로젝트는 휘슬러 마운틴 바이킹 여행을 위한 종합 가이드 웹사이트입니다.

### 주요 기능
- 📊 실제 사용 비용 상세 내역
- 📸 여행 사진 갤러리 (업로드 기능)
- 🗺️ 여행 정보 및 팁
- 💰 비용 분석 및 절약 팁

## 🛠️ 기술 스택

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Deployment**: Vercel
- **Language**: TypeScript

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 메인 페이지
│   ├── expenses/
│   │   └── page.tsx          # 비용 페이지
│   ├── gallery/
│   │   └── page.tsx          # 갤러리 페이지
│   └── layout.tsx            # 공통 레이아웃
├── lib/
│   └── supabase.ts           # Supabase 클라이언트
└── types/
    └── photo.ts              # 타입 정의
```

## 🚀 배포

- **도메인**: https://canada.maslabs.kr
- **Vercel**: https://maslabs-canada.vercel.app

## 📊 실제 비용 요약

- **총 비용**: CAD 340.84 (약 ₩341,000)
- **주요 항목**: 반나절권, 보호장비 렌탈, 주차비, 주유비

## 🔗 관련 링크

- [실제 비용 상세 내역](/expenses)
- [여행 갤러리](/gallery)
- [메인 페이지](/)
