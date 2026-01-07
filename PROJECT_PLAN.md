graph LR
    %% منطقة الموقع والكود
    subgraph "1. الويب سايت والـ App"
        A[العميل يتم الدفع/الطلب] --> B{Logic الشحن}
        B -->|جمع الأوزان| C[حساب التكلفة النهائية]
        C --> D[إرسال الأوردر للـ Database]
    end

    %% منطقة الربط التقني
    subgraph "2. الربط مع شركة الشحن (API)"
        D --> E[API Call: إنشاء شحنة جديدة]
        E --> F[استقبال الـ Waybill / البوليصة]
    end

    %% منطقة العمليات اليدوية
    subgraph "3. التعبئة والتغليف (Packaging)"
        F --> G[تجهيز الفوطة/المفرش]
        G --> H[كيس شفاف داخلي]
        H --> I[كيس بولي خارجي متين]
        I --> J[لزق البوليصة المطبوعة]
    end

    %% منطقة اللوجستيات
    subgraph "4. التوصيل (App Delivery)"
        J --> K[طلب Pickup من الأبلكيشن]
        K --> L[مندوب الشركة يستلم الطرود]
        L --> M[توزيع يداً بيد للعملاء]
        M --> N[تحديث الحالة: تم التسليم]
    end

    %% الربط المالي
    N --> O[تحصيل الفلوس وتحويلها لحسابك]

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style E fill:#bbf,stroke:#333,stroke-width:4px
    style J fill:#fff,stroke:#333,stroke-dasharray: 5 5
    style O fill:#dfd,stroke:#333,stroke-width:2px