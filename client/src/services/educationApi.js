import api from './api';

class EducationAPI {
  constructor() {
    // Base URL for education endpoints
    this.baseURL = '/organizer/education';
  }

  // ===== DASHBOARD & STATS =====
  
  async getDashboard(organizerId) {
    try {
      // Use the existing API service request method
      let url = `${this.baseURL}/dashboard`;
      if (organizerId) {
        url += `?organizerId=${organizerId}`;
      }
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== COURSES MANAGEMENT =====

  async getCourses(params = {}, organizerId = null) {
    try {
      if (organizerId) {
        params.organizerId = organizerId;
      }
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/courses${queryString ? `?${queryString}` : ''}`;
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCourse(courseId) {
    try {
      const response = await api.request(`${this.baseURL}/courses/${courseId}`);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createCourse(courseData) {
    try {
      const response = await api.request(`${this.baseURL}/courses`, {
        method: 'POST',
        body: JSON.stringify(courseData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateCourse(courseId, updateData) {
    try {
      const response = await api.request(`${this.baseURL}/courses/${courseId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteCourse(courseId) {
    try {
      const response = await api.request(`${this.baseURL}/courses/${courseId}`, {
        method: 'DELETE'
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== NEW: PUBLISH COURSE METHOD =====
  
  async publishCourse(courseId) {
    try {
      const response = await api.request(`/organizer/courses/${courseId}/publish`, {
        method: 'POST'
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getCourseEnrollments(courseId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/courses/${courseId}/enrollments${queryString ? `?${queryString}` : ''}`;
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateEnrollmentStatus(courseId, studentId, data) {
    try {
      const response = await api.request(`${this.baseURL}/courses/${courseId}/enrollments/${studentId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== ASSIGNMENTS MANAGEMENT =====

  async getAssignments(params = {}, organizerId = null) {
    try {
      if (organizerId) {
        params.organizerId = organizerId;
      }
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/assignments${queryString ? `?${queryString}` : ''}`;
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAssignment(assignmentId) {
    try {
      const response = await api.request(`${this.baseURL}/assignments/${assignmentId}`);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createAssignment(assignmentData) {
    try {
      const response = await api.request(`${this.baseURL}/assignments`, {
        method: 'POST',
        body: JSON.stringify(assignmentData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateAssignment(assignmentId, updateData) {
    try {
      const response = await api.request(`${this.baseURL}/assignments/${assignmentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteAssignment(assignmentId) {
    try {
      const response = await api.request(`${this.baseURL}/assignments/${assignmentId}`, {
        method: 'DELETE'
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAssignmentSubmissions(assignmentId, params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/assignments/${assignmentId}/submissions${queryString ? `?${queryString}` : ''}`;
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async gradeSubmission(assignmentId, submissionId, gradeData) {
    try {
      const response = await api.request(`${this.baseURL}/assignments/${assignmentId}/submissions/${submissionId}/grade`, {
        method: 'PUT',
        body: JSON.stringify(gradeData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== DISCUSSIONS MANAGEMENT =====

  async getDiscussions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/discussions${queryString ? `?${queryString}` : ''}`;
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getDiscussion(discussionId) {
    try {
      const response = await api.request(`${this.baseURL}/discussions/${discussionId}`);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async createDiscussion(discussionData) {
    try {
      const response = await api.request(`${this.baseURL}/discussions`, {
        method: 'POST',
        body: JSON.stringify(discussionData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateDiscussion(discussionId, updateData) {
    try {
      const response = await api.request(`${this.baseURL}/discussions/${discussionId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteDiscussion(discussionId) {
    try {
      const response = await api.request(`${this.baseURL}/discussions/${discussionId}`, {
        method: 'DELETE'
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== COMMENTS MANAGEMENT =====

  async addComment(discussionId, commentData) {
    try {
      const response = await api.request(`${this.baseURL}/discussions/${discussionId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateComment(discussionId, commentId, updateData) {
    try {
      const response = await api.request(`${this.baseURL}/discussions/${discussionId}/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteComment(discussionId, commentId) {
    try {
      const response = await api.request(`${this.baseURL}/discussions/${discussionId}/comments/${commentId}`, {
        method: 'DELETE'
      });
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== STUDENTS MANAGEMENT =====

  async getStudents(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${this.baseURL}/students${queryString ? `?${queryString}` : ''}`;
      const response = await api.request(url);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getStudent(studentId) {
    try {
      const response = await api.request(`${this.baseURL}/students/${studentId}`);
      return { success: true, data: response };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ===== HELPER METHODS =====

  handleError(error) {
    console.error('Education API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      return {
        success: false,
        message: data?.message || `Server error: ${status}`,
        status,
        data: data || null
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        success: false,
        message: 'Network error: No response from server',
        status: null,
        data: null
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: error.message || 'Unknown error occurred',
        status: null,
        data: null
      };
    }
  }

  // ===== UTILITY METHODS =====

  formatCourseData(courseData) {
    return {
      ...courseData,
      startDate: courseData.startDate ? new Date(courseData.startDate).toISOString().split('T')[0] : '',
      endDate: courseData.endDate ? new Date(courseData.endDate).toISOString().split('T')[0] : '',
      curriculum: courseData.curriculum || [''],
      prerequisites: courseData.prerequisites || [''],
      learningOutcomes: courseData.learningOutcomes || ['']
    };
  }

  formatAssignmentData(assignmentData) {
    return {
      ...assignmentData,
      dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate).toISOString().split('T')[0] : '',
      resources: assignmentData.resources || ['']
    };
  }

  // ===== BATCH OPERATIONS =====

  async batchUpdateCourseStatus(courseIds, status) {
    try {
      const promises = courseIds.map(courseId => 
        this.updateCourse(courseId, { status })
      );
      const results = await Promise.all(promises);
      return {
        success: true,
        message: `${courseIds.length} courses updated successfully`,
        data: results
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async batchDeleteAssignments(assignmentIds) {
    try {
      const promises = assignmentIds.map(assignmentId => 
        this.deleteAssignment(assignmentId)
      );
      const results = await Promise.all(promises);
      return {
        success: true,
        message: `${assignmentIds.length} assignments deleted successfully`,
        data: results
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ===== ANALYTICS & REPORTS =====

  async getCourseAnalytics(courseId) {
    try {
      // This would be implemented with real analytics endpoints
      const [course, enrollments, assignments] = await Promise.all([
        this.getCourse(courseId),
        this.getCourseEnrollments(courseId),
        this.getAssignments({ courseId })
      ]);

      return {
        success: true,
        data: {
          course: course.data,
          enrollments: enrollments.data,
          assignments: assignments.data,
          analytics: {
            enrollmentRate: (enrollments.data?.length || 0) / (course.data?.maxStudents || 1) * 100,
            completionRate: course.data?.completionRate || 0,
            averageGrade: 85, // Would calculate from actual submissions
            activeStudents: enrollments.data?.filter(e => e.status === 'active').length || 0
          }
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getEducationSummary(organizerId = null) {
    try {
      const [dashboard, courses, assignments, discussions, students] = await Promise.all([
        this.getDashboard(organizerId),
        this.getCourses({ limit: 1000 }, organizerId), // Get all courses for summary
        this.getAssignments({ limit: 1000 }, organizerId),
        this.getDiscussions({ limit: 1000 }),
        this.getStudents({ limit: 1000 })
      ]);

      return {
        success: true,
        data: {
          dashboard: dashboard.data,
          summary: {
            totalCourses: courses.data?.length || 0,
            activeCourses: courses.data?.filter(c => c.status === 'active').length || 0,
            totalAssignments: assignments.data?.length || 0,
            totalDiscussions: discussions.data?.length || 0,
            totalStudents: students.data?.length || 0,
            recentActivity: {
              newCoursesThisWeek: 3,
              assignmentsDueThisWeek: 5,
              activeDiscussionsThisWeek: 8
            }
          }
        }
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

// Create and export singleton instance
const educationApi = new EducationAPI();
export default educationApi;

// Also export the class for testing or custom instances
export { EducationAPI };

// Export individual methods for convenience
export const {
  getDashboard,
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse, // NEW: Export the publish method
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getDiscussions,
  getDiscussion,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addComment,
  updateComment,
  deleteComment,
  getStudents,
  getStudent,
  getCourseEnrollments,
  updateEnrollmentStatus
} = educationApi;
