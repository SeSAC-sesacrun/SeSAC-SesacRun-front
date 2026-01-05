"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";
import PurchaseDetail from "@/components/profile/PurchaseDetail"; // Import PurchaseDetail component

// --- Interfaces based on Backend DTOs ---

interface UserResDto {
  id: number;
  email: string;
  name: string;
  role: string;
  createdTime: string;
  updatedTime: string;
  // 프론트에서 사용할 추가 속성 (옵션)
  avatar?: string;
}

interface OrderResponse {
  orderId: number;
  orderNumber: string;
  orderTitle: string; // From user JSON
  thumbnail: string; // From user JSON
  totalAmount: number;
  status: string; // 'PAID', 'PENDING' etc
  createdAt: string;
}

interface MyPostResDto {
  id: number;
  category: "STUDY" | "PROJECT" | "QNA"; // Backend enum Assumption
  status: "RECRUITING" | "COMPLETED" | "APPROVED"; // Backend enum Assumption
  title: string;
  currentMembers: number;
  totalMembers: number;
  view: number;
  createdAt: string;
}

interface MyMeetingResDto {
  id: number;
  postId: number;
  title: string;
  status: string;
  role: "ORGANIZER" | "PARTICIPANT";
}

export default function MyPage() {
  const { logout } = useAuth(); // AuthContext 리소스 활용
  const [activeTab, setActiveTab] = useState<
    "courses" | "posts" | "meetings" | "purchases" | "instructor"
  >("courses");
  const [postsSubTab, setPostsSubTab] = useState<"qna" | "study" | "project">(
    "qna"
  );
  const [meetingsFilter, setMeetingsFilter] = useState<
    "all" | "organizer" | "participant"
  >("all");

  // --- State for Purchase View ---
  const [purchaseViewMode, setPurchaseViewMode] = useState<"list" | "detail">(
    "list"
  );
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // --- State ---
  const [profile, setProfile] = useState<UserResDto | null>(null);
  const [purchases, setPurchases] = useState<OrderResponse[]>([]);
  const [posts, setPosts] = useState<MyPostResDto[]>([]);
  const [meetings, setMeetings] = useState<MyMeetingResDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [instructorCourses, setInstructorCourses] = useState<any[]>([]);
  const [instructorCoursesLoading, setInstructorCoursesLoading] =
    useState(false);
  const [instructorCoursesError, setInstructorCoursesError] = useState<
    string | null
  >(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [enrolledCoursesLoading, setEnrolledCoursesLoading] = useState(false);
  const [enrolledCoursesError, setEnrolledCoursesError] = useState<
    string | null
  >(null);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Profile
        const profileRes = await api.get("/api/users/me");
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
        }

        // 2. Purchases
        //const purchasesRes = await api.get("/api/users/me/purchases");
        const purchasesRes = await api.get("/api/orders/purchases");
        if (purchasesRes.data.success) {
          setPurchases(purchasesRes.data.data);
        }

        // 3. Posts
        const postsRes = await api.get("/api/users/me/posts");
        if (postsRes.data.success) {
          setPosts(postsRes.data.data);
        }

        // 4. Meetings
        const meetingsRes = await api.get("/api/users/me/meetings");
        if (meetingsRes.data.success) {
          setMeetings(meetingsRes.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile data", error);
        // 필요한 경우 에러 처리 (예: 토큰 만료 시 로그아웃 등은 axios interceptor에서 처리됨)
      } finally {
        setLoading(false);
      }
    };

    // 토큰이 있는 경우에만 호출 (AuthContext 보호 하에 있지만 안전하게)
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchAllData();
    }
  }, []);

  const handlePurchaseClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setPurchaseViewMode("detail");
  };

  const handleBackToList = () => {
    setSelectedOrderId(null);
    setPurchaseViewMode("list");
  };

  // 사이드바 탭 변경 시 구매내역 뷰 초기화
  useEffect(() => {
    if (activeTab !== "purchases") {
      handleBackToList();
    }
  }, [activeTab]);

  // 강의 삭제 핸들러
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (
      !confirm(
        `"${courseTitle}" 강의를 정말 삭제하시겠습니까?\n\n⚠️ 이 작업은 되돌릴 수 없습니다.\n⚠️ 모든 섹션, 강의, 관련 데이터가 함께 삭제됩니다.`
      )
    ) {
      return;
    }

    try {
      console.log("Deleting course:", courseId);
      const response = await api.delete(`/api/courses/${courseId}`);
      console.log("Delete response:", response);

      // 성공 시 state에서 제거
      setInstructorCourses((prev) =>
        prev.filter((course) => course.id !== courseId)
      );
      alert("✅ 강의가 성공적으로 삭제되었습니다.");
    } catch (error: any) {
      console.error("강의 삭제 실패:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      let errorMessage = "강의 삭제에 실패했습니다.";

      if (error.response?.status === 500) {
        errorMessage =
          "⚠️ 서버 오류가 발생했습니다.\n\n가능한 원인:\n- 강의에 수강생이 있는 경우\n- 주문/장바구니에 포함된 경우\n\n관리자에게 문의하거나 백엔드 로그를 확인해주세요.";
      } else if (error.response?.status === 403) {
        errorMessage =
          "⚠️ 권한이 없습니다.\n본인이 생성한 강의만 삭제할 수 있습니다.";
      } else if (error.response?.status === 404) {
        errorMessage =
          "⚠️ 강의를 찾을 수 없습니다.\n이미 삭제되었을 수 있습니다.";
      } else if (error.response?.data?.message) {
        errorMessage = `⚠️ ${error.response.data.message}`;
      }

      alert(errorMessage);
    }
  };

  // 운영 중인 강의 조회 API
  useEffect(() => {
    const fetchInstructorCourses = async () => {
      if (activeTab !== "instructor" || profile?.role !== "INSTRUCTOR") return;

      try {
        setInstructorCoursesLoading(true);
        setInstructorCoursesError(null);

        const response = await api.get("/api/courses/my");
        console.log("API Response:", response.data);

        // 백엔드는 Page<CourseResponse>를 반환
        // { success: true, data: { content: [...], totalElements: 10, ... } }
        const pageData = response.data.data;
        const courseList = pageData?.content || [];

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const formattedCourses = courseList.map((course: any) => ({
          id: course.id.toString(),
          title: course.title,
          students: course.studentCount || 0,
          price: course.price || 0,
          status: course.status || "DRAFT",
          thumbnail:
            course.thumbnail ||
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
          category: course.category || "",
        }));

        setInstructorCourses(formattedCourses);
      } catch (error: any) {
        console.error("운영 중인 강의 조회 실패:", error);
        setInstructorCoursesError(
          error.response?.data?.message || "강의 목록을 불러올 수 없습니다."
        );
      } finally {
        setInstructorCoursesLoading(false);
      }
    };

    fetchInstructorCourses();
  }, [activeTab, profile?.role]);

  // 수강 중인 강의 조회 API (학생용)
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (activeTab !== "courses") return;

      try {
        setEnrolledCoursesLoading(true);
        setEnrolledCoursesError(null);

        const response = await api.get("/api/courses/enrolled");
        console.log("Enrolled Courses API Response:", response.data);

        // 백엔드는 Page<CourseResponse>를 반환
        // { success: true, data: { content: [...], totalElements: 10, ... } }
        const pageData = response.data.data;
        const courseList = pageData?.content || [];

        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const formattedCourses = courseList.map((course: any) => ({
          id: course.id.toString(),
          title: course.title,
          progress: 0, // TODO: 진도율 API 연동 후 추가
          thumbnail:
            course.thumbnail ||
            "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        }));

        setEnrolledCourses(formattedCourses);
      } catch (error: any) {
        console.error("수강 중인 강의 조회 실패:", error);
        setEnrolledCoursesError(
          error.response?.data?.message || "강의 목록을 불러올 수 없습니다."
        );
      } finally {
        setEnrolledCoursesLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!profile) return null; // Should redirect or show error

  return (
    <div className="flex h-full grow flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-1 justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex w-full flex-col gap-6 md:flex-row md:gap-8">
          {/* Sidebar */}
          <aside className="w-full shrink-0 md:w-64">
            <div className="flex h-full flex-col gap-6 rounded-lg bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
              {/* User Profile */}
              <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div
                  className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-20"
                  style={{
                    backgroundImage: `url('${
                      profile.avatar ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                    }')`,
                  }}
                />
                <div className="text-center">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    {profile.name}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.email}
                  </p>
                  {profile.role === "INSTRUCTOR" && (
                    <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                      강사
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeTab === "courses"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 font-bold"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    school
                  </span>
                  <p className="text-sm">내 강의</p>
                </button>
                <button
                  onClick={() => setActiveTab("purchases")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeTab === "purchases"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 font-bold"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    receipt_long
                  </span>
                  <p className="text-sm">구매 내역</p>
                </button>
                <button
                  onClick={() => setActiveTab("posts")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeTab === "posts"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 font-bold"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    article
                  </span>
                  <p className="text-sm">게시글</p>
                </button>
                <button
                  onClick={() => setActiveTab("meetings")}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    activeTab === "meetings"
                      ? "bg-primary/10 text-primary dark:bg-primary/20 font-bold"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    groups
                  </span>
                  <p className="text-sm">모임</p>
                </button>
                {profile.role === "INSTRUCTOR" && (
                  <button
                    onClick={() => setActiveTab("instructor")}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                      activeTab === "instructor"
                        ? "bg-primary/10 text-primary dark:bg-primary/20 font-bold"
                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 font-medium"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      workspace_premium
                    </span>
                    <p className="text-sm">운영 중인 강의</p>
                  </button>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* My Courses Tab */}
            {activeTab === "courses" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    내 강의
                  </h2>
                  <Link
                    href="/courses"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    강의 둘러보기
                  </Link>
                </div>

                {/* 로딩 상태 */}
                {enrolledCoursesLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        강의 목록을 불러오는 중...
                      </p>
                    </div>
                  </div>
                )}

                {/* 에러 상태 */}
                {enrolledCoursesError && !enrolledCoursesLoading && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">
                      {enrolledCoursesError}
                    </p>
                  </div>
                )}

                {/* 강의 목록 */}
                {!enrolledCoursesLoading && !enrolledCoursesError && (
                  <>
                    {enrolledCourses.length === 0 ? (
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-800">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                          school
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          아직 수강 중인 강의가 없습니다.
                        </p>
                        <Link
                          href="/courses"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                        >
                          <span>강의 둘러보기</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((course) => (
                          <Link
                            key={course.id}
                            href={`/watch/${course.id}`}
                            className="group flex flex-col gap-4 rounded-xl bg-white dark:bg-gray-900 p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                          >
                            <div className="relative">
                              <div
                                className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
                                style={{
                                  backgroundImage: `url('${course.thumbnail}')`,
                                }}
                              />
                              {/* Play Button Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center justify-center size-16 bg-primary rounded-full">
                                  <span
                                    className="material-symbols-outlined text-white text-3xl"
                                    style={{
                                      fontVariationSettings: "'FILL' 1",
                                    }}
                                  >
                                    play_arrow
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-3">
                              <p className="text-base font-bold text-gray-900 dark:text-white">
                                {course.title}
                              </p>
                              <div className="flex flex-col gap-2">
                                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400">
                                  <span>진행률</span>
                                  <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                  <div
                                    className="bg-primary h-1.5 rounded-full"
                                    style={{ width: `${course.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === "purchases" && (
              <div className="flex flex-col gap-6">
                {purchaseViewMode === "list" ? (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      구매 내역
                    </h2>
                    <div className="space-y-4">
                      {purchases.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          구매 내역이 없습니다.
                        </div>
                      ) : (
                        purchases.map((purchase) => (
                          <div
                            key={purchase.orderId}
                            onClick={() =>
                              handlePurchaseClick(purchase.orderId)
                            }
                            className="flex gap-4 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div
                              className="w-24 h-24 sm:w-32 sm:h-20 bg-center bg-cover rounded-lg flex-shrink-0"
                              style={{
                                backgroundImage: `url('${
                                  purchase.thumbnail || "/placeholder.jpg"
                                }')`,
                              }}
                            />
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                                {purchase.orderTitle}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                주문번호: {purchase.orderNumber}
                              </p>
                              <div className="flex gap-2 text-sm text-gray-600 dark:text-gray-400">
                                <span>
                                  주문일:{" "}
                                  {new Date(
                                    purchase.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <span>•</span>
                                <span
                                  className={
                                    purchase.status === "COMPLETED"
                                      ? "text-green-500"
                                      : purchase.status === "CREATED"
                                      ? "text-yellow-500"
                                      : purchase.status === "REFUND"
                                      ? "text-red-500"
                                      : "text-gray-500"
                                  }
                                >
                                  {
                                    purchase.status === "COMPLETED"
                                      ? "결제 완료"
                                      : purchase.status === "REFUND"
                                      ? "환불됨"
                                      : purchase.status === "CREATED"
                                      ? "결제 대기중"
                                      : "알 수 없음" // 예상치 못한 상태
                                  }
                                </span>
                              </div>
                              <p className="text-sm font-bold text-primary mt-2">
                                {purchase.totalAmount.toLocaleString()}원
                              </p>
                            </div>
                            <div className="flex items-center">
                              <span className="material-symbols-outlined text-gray-400">
                                chevron_right
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <PurchaseDetail
                    orderId={selectedOrderId!}
                    onBackToList={handleBackToList}
                  />
                )}
              </div>
            )}

            {/* Posts Tab */}
            {activeTab === "posts" && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  게시글
                </h2>

                {/* Sub Tabs */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setPostsSubTab("qna")}
                    className={`px-4 py-2 text-sm transition-all border-b-2 ${
                      postsSubTab === "qna"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    Q&A
                  </button>
                  <button
                    onClick={() => setPostsSubTab("study")}
                    className={`px-4 py-2 text-sm transition-all border-b-2 ${
                      postsSubTab === "study"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    스터디
                  </button>
                  <button
                    onClick={() => setPostsSubTab("project")}
                    className={`px-4 py-2 text-sm transition-all border-b-2 ${
                      postsSubTab === "project"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    팀 프로젝트
                  </button>
                </div>

                {/* LIST - Filtered by subTab */}
                <div className="space-y-4">
                  {posts.filter((post) => {
                    if (postsSubTab === "qna") return post.category === "QNA"; // API 카테고리 확인 필요
                    if (postsSubTab === "study")
                      return post.category === "STUDY";
                    if (postsSubTab === "project")
                      return post.category === "PROJECT";
                    return false;
                  }).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      작성한 게시글이 없습니다.
                    </div>
                  ) : (
                    posts
                      .filter((post) => {
                        if (postsSubTab === "qna")
                          return post.category === "QNA";
                        if (postsSubTab === "study")
                          return post.category === "STUDY";
                        if (postsSubTab === "project")
                          return post.category === "PROJECT";
                        return false;
                      })
                      .map((post) => (
                        <Link
                          key={post.id}
                          href={`/community/${post.id}`}
                          className="block bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded font-bold ${
                                post.status === "RECRUITING"
                                  ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {post.status === "RECRUITING"
                                ? "모집중"
                                : "모집완료"}
                            </span>
                            {/* QnA가 아닌 경우에만 멤버 수 표시 */}
                            {post.category !== "QNA" && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {post.currentMembers}/{post.totalMembers}명
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            조회수 {post.view.toLocaleString()} • 작성일{" "}
                            {new Date(post.createdAt).toLocaleDateString()}
                          </p>
                        </Link>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Meetings Tab */}
            {activeTab === "meetings" && (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  모임
                </h2>

                {/* Filter Buttons */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setMeetingsFilter("all")}
                    className={`px-4 py-2 text-sm transition-all border-b-2 ${
                      meetingsFilter === "all"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => setMeetingsFilter("organizer")}
                    className={`px-4 py-2 text-sm transition-all border-b-2 ${
                      meetingsFilter === "organizer"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    모집자
                  </button>
                  <button
                    onClick={() => setMeetingsFilter("participant")}
                    className={`px-4 py-2 text-sm transition-all border-b-2 ${
                      meetingsFilter === "participant"
                        ? "border-primary text-primary font-bold"
                        : "border-transparent text-gray-600 dark:text-gray-400 font-medium"
                    }`}
                  >
                    참여자
                  </button>
                </div>

                <div className="space-y-4">
                  {meetings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      참여 중인 모임이 없습니다.
                    </div>
                  ) : (
                    meetings
                      .filter(
                        (meeting) =>
                          meetingsFilter === "all" ||
                          (meetingsFilter === "organizer" &&
                            meeting.role === "ORGANIZER") ||
                          (meetingsFilter === "participant" &&
                            meeting.role === "PARTICIPANT")
                      )
                      .map((meeting) => (
                        <div
                          key={meeting.id}
                          className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`text-xs px-2 py-1 rounded font-bold ${
                                meeting.status === "RECRUITING"
                                  ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                              }`}
                            >
                              {meeting.status === "RECRUITING"
                                ? "모집중"
                                : "완료"}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {meeting.role === "ORGANIZER"
                                ? "모집자"
                                : "참여자"}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {meeting.title}
                          </h3>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* Instructor Courses Tab */}
            {activeTab === "instructor" && profile.role === "INSTRUCTOR" && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    운영 중인 강의
                  </h2>
                  <Link
                    href="/instructor/create-course"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                  >
                    <span className="material-symbols-outlined text-lg">
                      add
                    </span>
                    <span>새 강의 만들기</span>
                  </Link>
                </div>

                {/* 로딩 상태 */}
                {instructorCoursesLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400">
                        강의 목록을 불러오는 중...
                      </p>
                    </div>
                  </div>
                )}

                {/* 에러 상태 */}
                {instructorCoursesError && !instructorCoursesLoading && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400">
                      {instructorCoursesError}
                    </p>
                  </div>
                )}

                {/* 강의 목록 */}
                {!instructorCoursesLoading && !instructorCoursesError && (
                  <>
                    {instructorCourses.length === 0 ? (
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-12 text-center border border-gray-200 dark:border-gray-800">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">
                          school
                        </span>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          아직 생성한 강의가 없습니다.
                        </p>
                        <Link
                          href="/instructor/create-course"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/90"
                        >
                          <span className="material-symbols-outlined text-lg">
                            add
                          </span>
                          <span>첫 강의 만들기</span>
                        </Link>
                      </div>
                    ) : (
                      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  아이콘
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  강의명
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  총 수강생
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  가격
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  총 수익
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  상태
                                </th>
                                <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                  관리
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {instructorCourses.map((course) => {
                                const revenue = course.price * course.students;
                                const statusText =
                                  course.status === "PUBLISHED"
                                    ? "미작성"
                                    : course.status === "DRAFT"
                                    ? "작성중"
                                    : "미작성";
                                const statusColor =
                                  course.status === "PUBLISHED"
                                    ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                                    : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";

                                return (
                                  <tr
                                    key={course.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                  >
                                    <td className="px-4 py-4">
                                      <div
                                        className="w-12 h-12 bg-center bg-cover rounded"
                                        style={{
                                          backgroundImage: `url('${course.thumbnail}')`,
                                        }}
                                      />
                                    </td>
                                    <td className="px-4 py-4">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                        {course.title}
                                      </p>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      <span className="text-sm text-gray-900 dark:text-white">
                                        {course.students.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        ₩{course.price.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                      <span className="text-sm font-bold text-primary">
                                        ₩{revenue.toLocaleString()}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                      <span
                                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${statusColor}`}
                                      >
                                        {statusText}
                                      </span>
                                    </td>
                                    <td className="px-4 py-4">
                                      <div className="flex items-center justify-center gap-2">
                                        <div className="flex flex-col gap-2">
                                          <Link
                                            href={`/instructor/create-course?id=${course.id}`}
                                            className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
                                          >
                                            강의 수정
                                          </Link>
                                          <button
                                            onClick={() =>
                                              handleDeleteCourse(
                                                course.id,
                                                course.title
                                              )
                                            }
                                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700 transition-colors shadow-sm whitespace-nowrap"
                                          >
                                            강의 삭제
                                          </button>
                                        </div>
                                        <Link
                                          href={`/courses/${course.id}`}
                                          className="p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                                          title="미리보기"
                                        >
                                          <span className="material-symbols-outlined text-lg">
                                            visibility
                                          </span>
                                        </Link>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
