import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import bcrypt from "bcryptjs";
import * as schema from "./schema";

const sqlite = new Database("data/sqlite.db");
const db = drizzle(sqlite, { schema });

async function seed() {
  // Create default admin user (admin / admin123)
  const passwordHash = await bcrypt.hash("admin2020", 10);
  const existingAdmin = sqlite
    .prepare("SELECT id FROM users WHERE username = ?")
    .get("admin");

  if (!existingAdmin) {
    db.insert(schema.users).values({
      username: "admin",
      passwordHash,
    }).run();
    console.log("Created default admin user: admin / admin2020");
  }

  // Seed some sample projects
  const projectCount = sqlite
    .prepare("SELECT COUNT(*) as count FROM projects")
    .get() as { count: number };
  if (projectCount.count === 0) {
    const sampleProjects = [
      {
        title: "智慧城市管理平台",
        slug: "smart-city-platform",
        description: "为城市管理者提供全方位的数据分析和决策支持系统，实现城市运行态势的实时监控与智能预警。",
        content: "## 项目背景\n\n随着城市化进程的加速，城市管理面临着越来越多的挑战。我们为某省会城市开发了一套智慧城市管理平台，整合了交通、环境、公共安全等多维度数据。\n\n## 核心功能\n\n- 实时数据采集与监控\n- 智能预警与决策支持\n- 多部门协同管理\n- 市民服务一体化",
        coverImage: "",
        published: true,
      },
      {
        title: "企业数字化转型解决方案",
        slug: "enterprise-digital-transformation",
        description: "帮助传统制造企业实现生产流程的数字化改造，提升生产效率和管理水平。",
        content: "## 项目概述\n\n为某大型制造企业提供端到端的数字化转型服务，涵盖生产管理、供应链优化、质量控制等核心环节。\n\n## 项目成果\n\n- 生产效率提升 35%\n- 库存周转率提高 40%\n- 质量缺陷率降低 60%",
        coverImage: "",
        published: true,
      },
      {
        title: "在线教育平台",
        slug: "online-education-platform",
        description: "构建面向高校的在线教育平台，支持直播授课、录播回放、在线考试等功能。",
        content: "## 平台简介\n\n为多所高校提供一站式在线教育解决方案，支持千万级用户并发访问。\n\n## 技术亮点\n\n- 低延迟直播技术\n- 智能排课系统\n- AI 辅助阅卷\n- 学情分析引擎",
        coverImage: "",
        published: true,
      },
    ];

    for (const project of sampleProjects) {
      db.insert(schema.projects).values(project).run();
    }
    console.log("Seeded sample projects");
  }

  // Seed sample news
  const newsCount = sqlite
    .prepare("SELECT COUNT(*) as count FROM news")
    .get() as { count: number };
  if (newsCount.count === 0) {
    const sampleNews = [
      {
        title: "公司荣获2024年度最佳技术创新奖",
        slug: "best-tech-innovation-award-2024",
        summary: "凭借在智慧城市领域的突出贡献，公司荣获年度最佳技术创新奖。",
        content: "近日，在2024年中国科技创新大会上，我司凭借智慧城市管理平台项目荣获年度最佳技术创新奖。这是对公司技术实力和创新能力的高度认可。\n\n公司CEO表示，将继续加大研发投入，为客户提供更优质的产品和服务。",
        coverImage: "",
        published: true,
      },
      {
        title: "公司与某省政府签署战略合作协议",
        slug: "strategic-cooperation-agreement",
        summary: "双方将在数字政府建设领域展开深度合作。",
        content: "2024年6月，我司与某省政府签署战略合作协议，双方将在数字政府建设、数据治理等领域开展深入合作。\n\n此次合作将进一步巩固公司在政务数字化领域的领先地位。",
        coverImage: "",
        published: true,
      },
      {
        title: "公司乔迁新址，开启发展新篇章",
        slug: "new-office-opening",
        summary: "公司总部乔迁至科技园区，办公面积扩大3倍。",
        content: "随着业务规模的持续扩大，公司总部正式迁入位于高新技术产业开发区的新办公楼。\n\n新办公楼配备了先进的研发设施和舒适的办公环境，为公司未来发展奠定了坚实基础。",
        coverImage: "",
        published: true,
      },
    ];

    for (const item of sampleNews) {
      db.insert(schema.news).values(item).run();
    }
    console.log("Seeded sample news");
  }

  // Seed company culture
  const cultureCount = sqlite
    .prepare("SELECT COUNT(*) as count FROM culture")
    .get() as { count: number };
  if (cultureCount.count === 0) {
    const cultureItems = [
      {
        type: "vision",
        title: "我们的愿景",
        content: "成为全球领先的数字化解决方案提供商，用技术驱动社会进步。",
        sortOrder: 1,
      },
      {
        type: "mission",
        title: "我们的使命",
        content: "以创新技术赋能千行百业，帮助客户实现数字化转型，创造可持续的商业价值。",
        sortOrder: 2,
      },
      {
        type: "values",
        title: "核心价值观",
        content: "创新驱动：持续探索前沿技术，保持技术领先优势。\n客户至上：深入理解客户需求，提供超出预期的服务。\n合作共赢：与合作伙伴共同成长，构建开放生态。\n诚信担当：言出必行，勇于承担责任。",
        sortOrder: 3,
      },
    ];

    for (const item of cultureItems) {
      db.insert(schema.culture).values(item).run();
    }
    console.log("Seeded company culture items");
  }

  // Seed site settings
  const settingsCount = sqlite
    .prepare("SELECT COUNT(*) as count FROM site_settings")
    .get() as { count: number };
  if (settingsCount.count === 0) {
    const defaultSettings = [
      { key: "site_name", value: "XX科技有限公司" },
      { key: "site_description", value: "专注于数字化解决方案的科技公司" },
      { key: "contact_email", value: "contact@example.com" },
      { key: "contact_phone", value: "400-xxx-xxxx" },
      { key: "contact_address", value: "某市高新技术产业开发区" },
      { key: "footer_text", value: "© 2024 XX科技有限公司. All rights reserved." },
    ];

    for (const setting of defaultSettings) {
      db.insert(schema.siteSettings).values(setting).run();
    }
    console.log("Seeded site settings");
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
