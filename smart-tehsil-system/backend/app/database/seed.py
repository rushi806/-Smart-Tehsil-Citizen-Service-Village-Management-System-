"""
SEED DATA — FOR DEVELOPMENT/DEMO PURPOSES ONLY.
This is sample/demo data. It does NOT represent official government information.
All fees, documents, and service details must be verified with the actual Tehsil office.
"""
from datetime import date, datetime, timezone, timedelta
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User, UserRole
from app.models.staff import Staff, Department, StaffStatus
from app.models.service import Service, FAQ
from app.models.document import RequiredDocument
from app.models.village import Village, GramPanchayat
from app.models.scheme import GovernmentScheme
from app.models.notice import Notice, NoticeCategory, NoticePriority
from app.models.complaint import Complaint
from app.models.ai_kb import AIKnowledgeBase
from app.models.appointment import TimeSlot


def run_seed(db: Session):
    print("🌱 Running seed data...")

    # ==================== USERS ====================
    admin = User(
        full_name="System Administrator",
        email="admin@tehsil.gov.in",
        phone="9000000001",
        hashed_password=hash_password("Admin@123"),
        role=UserRole.admin,
        is_active=True,
        is_verified=True,
    )
    officer = User(
        full_name="Rajesh Sharma",
        email="officer@tehsil.gov.in",
        phone="9000000002",
        hashed_password=hash_password("Officer@123"),
        role=UserRole.officer,
        is_active=True,
        is_verified=True,
    )
    staff_user = User(
        full_name="Priya Patel",
        email="staff@tehsil.gov.in",
        phone="9000000003",
        hashed_password=hash_password("Staff@123"),
        role=UserRole.staff,
        is_active=True,
        is_verified=True,
    )
    citizen1 = User(
        full_name="Demo Citizen",
        email="citizen@example.com",
        phone="9000000004",
        hashed_password=hash_password("Citizen@123"),
        role=UserRole.citizen,
        is_active=True,
        is_verified=True,
        address="123, Demo Street, Demo City",
    )
    db.add_all([admin, officer, staff_user, citizen1])
    db.commit()

    # ==================== DEPARTMENTS ====================
    dept_revenue = Department(name="Revenue Department", code="REV", description="Handles revenue and land records", location="Room 101", phone="02512-000001")
    dept_social = Department(name="Social Welfare Department", code="SOC", description="Social welfare schemes and certificates", location="Room 102", phone="02512-000002")
    dept_health = Department(name="Health Department", code="HLT", description="Health certificates and services", location="Room 103", phone="02512-000003")
    dept_general = Department(name="General Administration", code="GEN", description="General administration and public services", location="Room 104", phone="02512-000004")
    db.add_all([dept_revenue, dept_social, dept_health, dept_general])
    db.commit()

    # ==================== STAFF PROFILES ====================
    staff_profile = Staff(
        user_id=staff_user.id,
        department_id=dept_revenue.id,
        employee_id="EMP001",
        designation="Talathi / Village Accountant",
        office_room="Room 101-A",
        official_phone="02512-000010",
        official_email="talathi@tehsil.gov.in",
        responsibilities="Income, caste and domicile certificate processing",
        working_days="Monday to Saturday",
        working_hours="10:00 AM - 5:00 PM",
        status=StaffStatus.present,
        is_public=True,
        join_date=date(2020, 6, 15),
    )
    officer_profile = Staff(
        user_id=officer.id,
        department_id=dept_revenue.id,
        employee_id="OFF001",
        designation="Tehsildar",
        office_room="Room 201",
        official_phone="02512-000020",
        official_email="tehsildar@tehsil.gov.in",
        responsibilities="Overall administration and approval of certificates",
        working_days="Monday to Friday",
        working_hours="10:00 AM - 5:00 PM",
        status=StaffStatus.present,
        is_public=True,
        join_date=date(2018, 1, 1),
    )
    db.add_all([staff_profile, officer_profile])
    db.commit()

    # ==================== SERVICES ====================
    income_cert = Service(
        name="Income Certificate",
        name_hi="आय प्रमाणपत्र",
        name_mr="उत्पन्न दाखला",
        slug="income-certificate",
        description="[DEMO] Certificate showing annual family income. This is sample data — verify with actual Tehsil.",
        eligibility="Any resident of the Tehsil",
        fees=20.0,
        processing_time_days=7,
        application_procedure="Submit form with required documents to Revenue Department counter",
        department_id=dept_revenue.id,
        responsible_designation="Talathi",
        office_room="Room 101-A",
        category="Revenue",
        is_active=True,
        is_featured=True,
        icon="file-text",
    )
    caste_cert = Service(
        name="Caste Certificate",
        name_hi="जाति प्रमाणपत्र",
        name_mr="जात प्रमाणपत्र",
        slug="caste-certificate",
        description="[DEMO] Certificate verifying caste/category. Verify requirements with actual Tehsil.",
        eligibility="Residents belonging to SC/ST/OBC categories",
        fees=20.0,
        processing_time_days=15,
        application_procedure="Apply with prescribed form and proof of caste",
        department_id=dept_social.id,
        responsible_designation="Social Welfare Officer",
        office_room="Room 102",
        category="Social Welfare",
        is_active=True,
        is_featured=True,
        icon="users",
    )
    domicile_cert = Service(
        name="Domicile Certificate",
        name_hi="अधिवास प्रमाणपत्र",
        name_mr="अधिवास प्रमाणपत्र",
        slug="domicile-certificate",
        description="[DEMO] Certificate proving residency in the state/district.",
        eligibility="Residents who have lived in the area for required period",
        fees=20.0,
        processing_time_days=10,
        application_procedure="Submit prescribed form with address proof",
        department_id=dept_revenue.id,
        responsible_designation="Talathi",
        office_room="Room 101-A",
        category="Revenue",
        is_active=True,
        is_featured=True,
        icon="home",
    )
    residence_cert = Service(
        name="Residence Certificate",
        name_hi="निवास प्रमाणपत्र",
        name_mr="राहण्याचा दाखला",
        slug="residence-certificate",
        description="[DEMO] Certificate proving current residential address.",
        eligibility="Any resident with valid address proof",
        fees=10.0,
        processing_time_days=7,
        application_procedure="Submit form with address documents",
        department_id=dept_revenue.id,
        responsible_designation="Talathi",
        office_room="Room 101-A",
        category="Revenue",
        is_active=True,
        is_featured=False,
        icon="map-pin",
    )
    ncl_cert = Service(
        name="Non-Creamy Layer Certificate",
        name_hi="नॉन क्रीमी लेयर प्रमाणपत्र",
        name_mr="नॉन क्रिमी लेयर दाखला",
        slug="non-creamy-layer-certificate",
        description="[DEMO] Certificate for OBC applicants confirming non-creamy layer status.",
        eligibility="OBC applicants whose family income is below specified limit",
        fees=20.0,
        processing_time_days=15,
        application_procedure="Apply with income proof and caste certificate",
        department_id=dept_social.id,
        responsible_designation="Social Welfare Officer",
        office_room="Room 102",
        category="Social Welfare",
        is_active=True,
        is_featured=True,
        icon="shield",
    )
    db.add_all([income_cert, caste_cert, domicile_cert, residence_cert, ncl_cert])
    db.commit()

    # ==================== REQUIRED DOCUMENTS ====================
    income_docs = [
        RequiredDocument(service_id=income_cert.id, document_name="Aadhaar Card", document_name_hi="आधार कार्ड", document_name_mr="आधार कार्ड", is_mandatory=True, sort_order=1),
        RequiredDocument(service_id=income_cert.id, document_name="Ration Card", document_name_hi="राशन कार्ड", document_name_mr="रेशन कार्ड", is_mandatory=True, sort_order=2),
        RequiredDocument(service_id=income_cert.id, document_name="Passport Size Photograph", is_mandatory=True, sort_order=3),
        RequiredDocument(service_id=income_cert.id, document_name="Self-Declaration of Income", is_mandatory=True, sort_order=4, notes="[DEMO] Verify current requirements with Tehsil office"),
    ]
    caste_docs = [
        RequiredDocument(service_id=caste_cert.id, document_name="Aadhaar Card", is_mandatory=True, sort_order=1),
        RequiredDocument(service_id=caste_cert.id, document_name="Previous Caste Certificate (if any)", is_mandatory=False, sort_order=2),
        RequiredDocument(service_id=caste_cert.id, document_name="Father's/Grandfather's Caste Proof", is_mandatory=True, sort_order=3),
        RequiredDocument(service_id=caste_cert.id, document_name="Passport Size Photograph", is_mandatory=True, sort_order=4),
    ]
    domicile_docs = [
        RequiredDocument(service_id=domicile_cert.id, document_name="Aadhaar Card", is_mandatory=True, sort_order=1),
        RequiredDocument(service_id=domicile_cert.id, document_name="Proof of Residence (Utility Bill/Ration Card)", is_mandatory=True, sort_order=2),
        RequiredDocument(service_id=domicile_cert.id, document_name="Passport Size Photograph", is_mandatory=True, sort_order=3),
    ]
    ncl_docs = [
        RequiredDocument(service_id=ncl_cert.id, document_name="Aadhaar Card", is_mandatory=True, sort_order=1),
        RequiredDocument(service_id=ncl_cert.id, document_name="Caste Certificate", is_mandatory=True, sort_order=2),
        RequiredDocument(service_id=ncl_cert.id, document_name="Income Certificate", is_mandatory=True, sort_order=3),
        RequiredDocument(service_id=ncl_cert.id, document_name="Passport Size Photograph", is_mandatory=True, sort_order=4),
    ]
    db.add_all(income_docs + caste_docs + domicile_docs + ncl_docs)
    db.commit()

    # ==================== FAQs ====================
    faqs = [
        FAQ(service_id=income_cert.id, question="How long does it take to get an income certificate?", answer="[DEMO] Approximately 7 working days after document verification. Please verify with the actual Tehsil office.", sort_order=1),
        FAQ(service_id=income_cert.id, question="What is the validity of the income certificate?", answer="[DEMO] Generally valid for one year from the date of issue. Check with the issuing authority.", sort_order=2),
        FAQ(service_id=caste_cert.id, question="Can I apply for caste certificate online?", answer="[DEMO] Currently applications are accepted in person. Online services may be available — check with Tehsil office.", sort_order=1),
        FAQ(service_id=None, question="What are the working hours of the Tehsil office?", answer="[DEMO] Monday to Friday, 10:00 AM to 5:00 PM. Saturday 10:00 AM to 2:00 PM. Verify with actual office.", sort_order=1),
        FAQ(service_id=None, question="How can I track my application?", answer="Use the 'Track Application' feature on this portal with your Application ID.", sort_order=2),
    ]
    db.add_all(faqs)
    db.commit()

    # ==================== GRAM PANCHAYATS ====================
    gp1 = GramPanchayat(name="Demo Gram Panchayat 1", district="Demo District", tehsil="Demo Tehsil", contact_person="Sarpanch: Demo Name", contact_phone="9100000001")
    gp2 = GramPanchayat(name="Demo Gram Panchayat 2", district="Demo District", tehsil="Demo Tehsil", contact_person="Sarpanch: Demo Name 2", contact_phone="9100000002")
    db.add_all([gp1, gp2])
    db.commit()

    # ==================== VILLAGES ====================
    villages = [
        Village(name="Demo Village Alpha", gram_panchayat_id=gp1.id, tehsil="Demo Tehsil", district="Demo District", pin_code="000001", population=2500, households=450, area_hectares=120.5, latitude=19.9975, longitude=73.7898, has_school=True, has_health_centre=True, has_anganwadi=True, has_electricity=True, has_paved_road=True, description="[DEMO] Sample village data for demonstration."),
        Village(name="Demo Village Beta", gram_panchayat_id=gp1.id, tehsil="Demo Tehsil", district="Demo District", pin_code="000002", population=1800, households=320, area_hectares=85.0, latitude=20.0050, longitude=73.7950, has_school=True, has_anganwadi=True, has_electricity=True, description="[DEMO] Sample village data."),
        Village(name="Demo Village Gamma", gram_panchayat_id=gp2.id, tehsil="Demo Tehsil", district="Demo District", pin_code="000003", population=3200, households=580, area_hectares=200.0, latitude=19.9900, longitude=73.8000, has_school=True, has_health_centre=True, has_anganwadi=True, has_govt_office=True, has_water_facility=True, has_electricity=True, has_paved_road=True, description="[DEMO] Sample village data."),
        Village(name="Demo Village Delta", gram_panchayat_id=gp2.id, tehsil="Demo Tehsil", district="Demo District", pin_code="000004", population=900, households=160, area_hectares=45.0, latitude=20.0100, longitude=73.8050, has_anganwadi=True, has_electricity=True, description="[DEMO] Sample village data."),
    ]
    db.add_all(villages)
    db.commit()

    # ==================== SCHEMES ====================
    schemes = [
        GovernmentScheme(
            name="PM Awas Yojana (Demo)",
            description="[DEMO] Housing scheme for economically weaker sections. Verify details at official government website.",
            eligibility="Below Poverty Line families",
            benefits="Financial assistance for house construction",
            category="housing",
            official_website="https://pmaymis.gov.in",
        ),
        GovernmentScheme(
            name="PM Kisan Samman Nidhi (Demo)",
            description="[DEMO] Direct income support for farmers. Verify at official PM-KISAN portal.",
            eligibility="Farmer families with cultivable land",
            benefits="Rs. 6000 per year in three installments",
            category="farmer",
            official_website="https://pmkisan.gov.in",
        ),
        GovernmentScheme(
            name="Scholarship for SC/ST Students (Demo)",
            description="[DEMO] Scholarship for students belonging to SC/ST category. Verify requirements with Social Welfare office.",
            eligibility="SC/ST students studying in recognized institutions",
            benefits="Scholarship amount as per government norms",
            category="student",
        ),
        GovernmentScheme(
            name="Mahila Shakti Kendra (Demo)",
            description="[DEMO] Scheme for women empowerment. Verify with Women and Child Development dept.",
            eligibility="Women beneficiaries as per scheme guidelines",
            benefits="Training, skill development, and financial support",
            category="women",
        ),
    ]
    db.add_all(schemes)
    db.commit()

    # ==================== NOTICES ====================
    notices = [
        Notice(
            title="[DEMO] Office Closure Notice",
            description="[DEMO NOTICE] This is a sample notice. The office will be closed on the occasion of a public holiday.",
            category=NoticeCategory.holiday,
            priority=NoticePriority.high,
            is_published=True,
            published_by=admin.id,
            publish_date=datetime.now(timezone.utc),
        ),
        Notice(
            title="[DEMO] Document Verification Camp",
            description="[DEMO NOTICE] A special document verification camp will be held. This is sample data.",
            category=NoticeCategory.camp,
            priority=NoticePriority.normal,
            is_published=True,
            published_by=admin.id,
            publish_date=datetime.now(timezone.utc),
        ),
        Notice(
            title="[DEMO] Announcement — New Service Added",
            description="[DEMO NOTICE] Sample announcement for demonstration purposes.",
            category=NoticeCategory.announcement,
            priority=NoticePriority.normal,
            is_published=True,
            published_by=admin.id,
            publish_date=datetime.now(timezone.utc),
        ),
    ]
    db.add_all(notices)
    db.commit()

    # ==================== AI KNOWLEDGE BASE ====================
    kb_entries = [
        AIKnowledgeBase(
            topic="Income Certificate",
            question_patterns=["income certificate", "income proof", "income ka certificate", "utpanna dakhala", "aay praman"],
            answer_en="[DEMO] To apply for an Income Certificate at our Tehsil, you typically need: Aadhaar Card, Ration Card, Passport-size photo, and a self-declaration. Fee is approximately ₹20. Processing takes about 7 working days. NOTE: Verify exact requirements with the Tehsil office.",
            answer_hi="[DEMO] आय प्रमाणपत्र के लिए आपको आधार कार्ड, राशन कार्ड, फोटो आवश्यक है। कृपया तहसील से सत्यापित करें।",
            answer_mr="[DEMO] उत्पन्न दाखल्यासाठी आधार, रेशन कार्ड, फोटो लागतो. तहसील कार्यालयाशी संपर्क करा.",
            category="services",
            tags=["income", "certificate", "revenue"],
        ),
        AIKnowledgeBase(
            topic="Caste Certificate",
            question_patterns=["caste certificate", "jati praman", "category certificate", "sc certificate", "obc certificate", "jaat praman"],
            answer_en="[DEMO] For a Caste Certificate, you need: Aadhaar Card, previous caste certificate (if any), father's caste proof, and a passport-size photo. Apply at Social Welfare Dept counter, Room 102. NOTE: Verify with the actual office.",
            answer_hi="[DEMO] जाति प्रमाणपत्र के लिए आधार, पिता का जाति प्रमाण, और फोटो आवश्यक है।",
            answer_mr="[DEMO] जात प्रमाणपत्रासाठी आधार, वडिलांचा जात दाखला आणि फोटो लागतो.",
            category="services",
            tags=["caste", "sc", "st", "obc", "certificate"],
        ),
        AIKnowledgeBase(
            topic="Office Hours",
            question_patterns=["office hours", "working hours", "office time", "karyalay vel", "timing", "when is office open"],
            answer_en="[DEMO] The Tehsil office is generally open Monday to Friday 10:00 AM to 5:00 PM, Saturday 10:00 AM to 2:00 PM. Government holidays apply. Please verify with the actual office.",
            answer_hi="[DEMO] तहसील कार्यालय सोमवार से शुक्रवार 10 बजे से 5 बजे तक खुला रहता है।",
            answer_mr="[DEMO] तहसील कार्यालय सोमवार ते शुक्रवार सकाळी १० ते सायंकाळी ५ वाजेपर्यंत उघडे असते.",
            category="general",
            tags=["hours", "time", "office"],
        ),
        AIKnowledgeBase(
            topic="How to track application",
            question_patterns=["track application", "application status", "check status", "track my application", "application number"],
            answer_en="You can track your application by clicking 'Track Application' in the menu and entering your Application ID (e.g., INC-2026-000123). No login required for basic tracking.",
            category="general",
            tags=["track", "application", "status"],
        ),
        AIKnowledgeBase(
            topic="Domicile Certificate",
            question_patterns=["domicile certificate", "adhiwas praman", "residence proof", "state resident certificate"],
            answer_en="[DEMO] Domicile Certificate requires: Aadhaar Card, proof of residence (utility bill or ration card), and passport-size photo. Apply at Revenue Department, Room 101-A. Processing takes about 10 working days. Verify requirements with Tehsil office.",
            category="services",
            tags=["domicile", "residence", "certificate"],
        ),
    ]
    db.add_all(kb_entries)
    db.commit()

    # ==================== SAMPLE TIME SLOTS ====================
    tomorrow = date.today() + timedelta(days=1)
    slots = [
        TimeSlot(department_id=dept_revenue.id, slot_date=tomorrow, start_time="10:00", end_time="10:30", capacity=3),
        TimeSlot(department_id=dept_revenue.id, slot_date=tomorrow, start_time="10:30", end_time="11:00", capacity=3),
        TimeSlot(department_id=dept_revenue.id, slot_date=tomorrow, start_time="11:00", end_time="11:30", capacity=3),
        TimeSlot(department_id=dept_revenue.id, slot_date=tomorrow, start_time="02:00", end_time="02:30", capacity=2),
        TimeSlot(department_id=dept_social.id, slot_date=tomorrow, start_time="10:00", end_time="10:30", capacity=2),
        TimeSlot(department_id=dept_social.id, slot_date=tomorrow, start_time="11:00", end_time="11:30", capacity=2),
    ]
    db.add_all(slots)
    db.commit()

    print("✅ Seed data complete!")
    print("   Admin:   admin@tehsil.gov.in / Admin@123")
    print("   Officer: officer@tehsil.gov.in / Officer@123")
    print("   Staff:   staff@tehsil.gov.in / Staff@123")
    print("   Citizen: citizen@example.com / Citizen@123")
    print("   ⚠️  All data is DEMO — not official government information.")
