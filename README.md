# π² blemarket
> [λΉκ·Όλ§μΌ ν΄λ‘ μ½λ© - λΈλ§λ μ½λ](https://nomadcoders.co/carrot-market)μ μκ°νλ©΄μ κΈ°λ³Έ μ½λλ₯Ό μμ±νκ³  νμν κΈ°λ₯λ€μ μΆκ°ν νλ‘μ νΈμλλ€.

+ [trello](https://trello.com/b/AT4Z2NOe/blemarket)
+ [velog](https://velog.io/@1-blue/series/blemarket)
+ [blemarket - by vercel](https://blemarket.vercel.app)

<section align="center">
  <h2 style="text-align: center; margin: 0;">π οΈ μ¬μ© κΈ°μ  π οΈ</h2>
  <img src="https://img.shields.io/badge/Next.js-818CF8?style=flat-square&logo=Next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=Typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCss-06B6D4?style=flat-square&logo=TailwindCss&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=Prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/SWR-818CF8?style=flat-square&logoColor=white" />
  <img src="https://img.shields.io/badge/AWS_S3-232F3E?style=flat-square&logo=AmazonAWS&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-818CF8?style=flat-square&logo=Vercel&logoColor=white" />
</section>

<section align="center">
  <h2 style="text-align: center; margin: 0;">πββοΈ μ¬μ© ν΄ πββοΈ</h2>
  <a href="https://trello.com/b/AT4Z2NOe/blemarket">
    <img src="https://img.shields.io/badge/Trello-0052CC?style=flat-square&logo=Trello&logoColor=white" />
  </a>
  <a href="https://velog.io/@1-blue/series/blemarket">
    <img src="https://img.shields.io/badge/Velog-20C997?style=flat-square&logo=Velog&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=Git&logoColor=white" />
  <a href="https://github.com/1-blue/blemarket">
    <img src="https://img.shields.io/badge/GitHub-609926?style=flat-square&logo=GitHub&logoColor=white" />
  </a>
  <img src="https://img.shields.io/badge/Sourcetree-0052CC?style=flat-square&logo=Sourcetree&logoColor=white" />
  <img src="https://img.shields.io/badge/VsCode-007ACC?style=flat-square&logo=VisualStudioCode&logoColor=white" />
</section>

# π κ΅¬ν κΈ°λ₯
1. μν κ²μκΈ CRUD
2. μν κ²μκΈ κ²μ λ° νν°λ§
3. μ»€λ?€λν° κ²μκΈ CRUD
4. μ»€λ?€λν° κ²μκΈ κ±°λ¦¬ κΈ°λ° κ²μ
5. λκΈ CRD
6. μ’μμ CRUD
7. μ±νλ°©/μ±ν CR
8. λ¦¬λ·° CRD
9. μν μν CRUD ( νλ§€μ€/μμ½μ€/μ’μμ/νλ§€μλ£ λ° κ΅¬λ§€μλ£ )
10. μν λ° μ μ  μ΄λ―Έμ§ μ²λ¦¬ ( `AWS-S3` )

# π κ°μ΄λ λΌμΈ
## 1. μ€μΉ
```bash
git clone https://github.com/1-blue/blemarket.git

cd blemarket

npm install
```

## 2. .env μμ±
```bash
# planet scaleμμ λ°°ν¬μ© urlμ λ°μμ λΆμ¬λ£μΌλ©΄ λ¨
DATABASE_URL="mysql://127.0.0.1:3306/blemarket"

COOKIE_SECRET=<μμ±>

BLEMARKET_AWS_REGION=<μμ±>
BLEMARKET_AWS_ACCESS_KEY=<μμ±>
BLEMARKET_AWS_SECRET_KEY=<μμ±>

# μ΄ λΆλΆμ verselλ‘ λ°°ν¬ν  λλ μ λ£μ΄μ€λ μλμΌλ‘ νμ¬ νμ΄μ§μ urlμ΄ λ€μ΄μ΄
NEXT_PUBLIC_VERCEL_URL=http://localhost:3000
```

## 3. μ€ν
```bash
# κ°λ° λͺ¨λ μ€ν
npm run dev

# λ°°ν¬ λͺ¨λ μ€ν
nm -rf .next && npm run build && npm start
```

## 4. λ°°ν¬
>[vercel](https://vercel.com)μ μ΄μ©ν λ°°ν¬

# πΈ μ€ν μ΄λ―Έμ§/μμ

## πΌοΈ μ΄λ―Έμ§ πΌοΈ
|λ‘κ·ΈμΈ νμ΄μ§|λ©μΈ νμ΄μ§|μ»€λ?€λν° νμ΄μ§|μ±ν νμ΄μ§|νλ‘ν νμ΄μ§|
|:-:|:-:|:-:|:-:|:-:|
|<img src="https://user-images.githubusercontent.com/63289318/165023650-41cf94d4-7036-40c1-ae0f-97a7796ec7ed.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023648-7c89cfd6-8150-49e0-aa2f-477bbe12e702.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023647-69ce049d-4ac0-4ab0-bb12-42e7aa3a88b9.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023646-d649b23c-ac14-4f66-9b70-658de596cb39.jpg" width="100%" />|<img src="https://user-images.githubusercontent.com/63289318/165023651-60b4b728-8c0e-4bc1-90c8-ed0901e8770e.jpg" width="100%" />|

## π½οΈ μ€ν μμ π½οΈ
1. μν κ²μ λ° νν°λ§
<img src="https://user-images.githubusercontent.com/63289318/165018145-3785b1d1-d72d-46ec-8490-894abae7e004.gif" width="100%" />
2. μν μ’μμ λ° λκΈ λ° μ±νλ°© μμ±
<img src="https://user-images.githubusercontent.com/63289318/165023971-92f33af2-f1f9-4d1f-890b-94fe4b1e562c.gif" width="100%" />
3. μ±ν
<img src="https://user-images.githubusercontent.com/63289318/165023955-dca04bba-d69a-41fb-ab58-27059bc4dd7d.gif" width="100%" />
4. μν μν λ³κ²½
<img src="https://user-images.githubusercontent.com/63289318/165023961-ac84e8df-85b1-483d-b0c7-77c911ee7ffc.gif" width="100%" />
