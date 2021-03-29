import {
    ContentStateResponse,
    CourseBatchDetailsRequest,
    CourseBatchesRequest,
    DisplayDiscussionForumRequest,
    EnrollCourseRequest,
    FetchEnrolledCourseRequest,
    GenerateAttemptIdRequest,
    GetContentStateRequest, GetLearnerCerificateRequest,
    GetUserEnrolledCoursesRequest,
    UpdateContentStateRequest
} from './request-types';
import {Observable} from 'rxjs';
import {Batch} from './batch';
import {Course} from './course';
import {UnenrollCourseRequest} from './unenrollCourseRequest';
import {GetCertificateRequest} from './get-certificate-request';
import {DownloadCertificateResponse} from './download-certificate-response';
import {SunbirdTelemetry} from '../../telemetry';
import Telemetry = SunbirdTelemetry.Telemetry;
import {LearnerCertificate} from './get-learner-certificate-response';
import {DownloadCertificateRequest} from './download-certificate-request';
import {ApiRequestHandler} from '../../api';
import {GetEnrolledCourseResponse} from './get-enrolled-course-response';

export interface CourseService {
    getBatchDetails(request: CourseBatchDetailsRequest): Observable<Batch>;

    updateContentState(request: UpdateContentStateRequest): Observable<boolean>;

    getCourseBatches(request: CourseBatchesRequest): Observable<Batch[]>;

    getEnrolledCourses(
        request: FetchEnrolledCourseRequest,
        apiHandler?: ApiRequestHandler<{ userId: string }, GetEnrolledCourseResponse>
    ): Observable<Course[]>;

    getUserEnrolledCourses(request: GetUserEnrolledCoursesRequest): Observable<Course[]>;

    enrollCourse(request: EnrollCourseRequest): Observable<boolean>;

    unenrollCourse(unenrollCourseRequest: UnenrollCourseRequest): Observable<boolean>;

    getContentState(contentStateRequest: GetContentStateRequest): Observable<ContentStateResponse | undefined>;

    downloadCurrentProfileCourseCertificate(
        downloadCertificateRequest: GetCertificateRequest
    ): Observable<DownloadCertificateResponse>;

    /** @internal */
    hasCapturedAssessmentEvent(request: {courseContext: any}): boolean;

    /** @internal */
    captureAssessmentEvent(capture: {event: Telemetry, courseContext: any});

    /** @internal */
    resetCapturedAssessmentEvents();

    syncAssessmentEvents(options?: { persistedOnly: boolean }): Observable<undefined>;

    generateAssessmentAttemptId(request: GenerateAttemptIdRequest): string;

    getCurrentProfileCourseCertificateV2(request: GetCertificateRequest): Observable<string>;

    downloadCurrentProfileCourseCertificateV2(request: DownloadCertificateRequest): Observable<DownloadCertificateResponse>;

    displayDiscussionForum(request: DisplayDiscussionForumRequest): Observable<boolean>;

    getLearnerCertificates(request: GetLearnerCerificateRequest): Observable<LearnerCertificate[]>;
}
