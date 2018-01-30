declare namespace wx {
  /**
   * callback回掉函数
   */
  export type BaseCallback = (res: any) => void;

  export interface BaseOptions {
    /**
     * 接口调用成功的回调函数
     */
    success?: BaseCallback;

    /**
     * 接口调用失败的回调函数
     */
    fail?: BaseCallback;

    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     */
    complete?: BaseCallback;
  }

  export interface SuccessOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     * @param {{errMsg: string}} res
     */
    success?: (res: { errMsg: string }) => void;
  }

  export interface ShareOptions {
    /**
     * 分享标题, 默认为当前小程序名称
     */
    title?: string;

    /**
     * 分享描述, 默认为当前小程序名称
     */
    desc?: string;

    /**
     * 分享路径, 默认为当前页面path, 必须是以 / 开头的完整路径
     */
    path?: string;
  }

  export interface IData {
    [key: string]: any;
  }

  // ---------------------------------- 网络API列表 ----------------------------------

  export interface RequestResult {
    /**
     * 开发者服务器返回的数据
     */
    data: string | IData | ArrayBuffer;
    /**
     * 开发者服务器返回的 HTTP 状态码
     */
    statusCode: number;
    /**
     * 开发者服务器返回的 HTTP Response Header
     * @version 1.2.0
     */
    header: IData
  }

  export interface RequestOptions extends BaseOptions {
    /**
     * 开发者服务器接口地址
     */
    url: string;

    /**
     * 请求的参数
     */
    data?: string | IData;

    /**
     * 设置请求的 header , header 中不能设置 Referer
     */
    header?: IData;

    /**
     * （需大写）有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     */
    methods?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

    /**
     * 默认为 json。如果设置了 dataType 为 json，则会尝试对响应的数据做一次 JSON.parse
     */
    dataType?: string;

    /**
     * 设置响应的数据类型。合法值：text、arraybuffer
     * @version 1.7.0
     */
    responseType?: string;

    /**
     * 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
     */
    success?: (res?: RequestResult) => void;
  }

  /**
   * 返回一个 requestTask 对象，通过 requestTask，可中断请求任务。
   * @version 1.4.0
   */
  export interface requestTask {
    abort?: () => void
  }

  /**
   * 发起网络请求。`wx.request`发起的是https请求。**一个微信小程序，同时只能有5个网络请求连接**。
   */
  export function request(options: RequestOptions): requestTask | void;

  export interface UploadFileResult {
    /**
     * 开发者服务器返回的数据
     */
    data: string;

    /**
     * HTTP状态码
     */
    statusCode: number;
  }

  /**
   * 返回一个 uploadTask 对象，通过 uploadTask，可监听上传进度变化事件，以及取消上传任务。
   * @version 1.4.0
   */
  export interface uploadTask {
    onProgressUpdate?: (callback: (res: onProgressUpdateResult) => void) => void;
    abort?: () => void;
  }

  /**
   * 返回一个 downloadTask 对象，通过 downloadTask，可监听上传进度变化事件，以及取消上传任务。
   * @version 1.4.0
   */
  export interface downloadTask extends uploadTask {

  }

  /**
   * 进度变化
   * @version 1.4.0
   */
  export interface onProgressUpdateResult {
    /**
     * 上传进度百分比
     */
    progress: number;

    /**
     * 已经上传的数据长度，单位 Bytes
     */
    totalBytesSent: number;

    /**
     * 预期需要上传的数据总长度，单位 Bytes
     */
    totalBytesExpectedToSend: number;
  }

  export interface UploadFileOptions extends BaseOptions {
    /**
     * 开发者服务器 url
     */
    url: string;

    /**
     * 要上传文件资源的路径
     */
    filePath: string;

    /**
     * 文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
     */
    name: string;

    /**
     * HTTP 请求 Header , header 中不能设置 Referer
     */
    header?: IData;

    /**
     * HTTP 请求中其他额外的 form data
     */
    formData?: IData;

    /**
     * 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
     */
    success?: (res?: UploadFileResult) => void;
  }

  /**
   * 将本地资源上传到开发者服务器。
   * 如页面通过 [wx.chooseImage](#wx.chooseImage) 等接口获取到一个本地资源的临时文件路径后，可通过此接口将本地资源上传到指定服务器。
   * 客户端发起一个 HTTPS POST 请求，其中 `Content-Type` 为 `multipart/form-data` 。
   */
  export function uploadFile(options: UploadFileOptions): uploadTask | void;

  export interface DownloadFileResult {
    /**
     * 文件的临时路径
     */
    tempFilePath: string;

    /**
     * 开发者服务器返回的 HTTP 状态码
     */
    statusCode: number;
  }

  export interface DownloadFileOptions extends BaseOptions {
    /**
     * 下载资源的 url
     */
    url: string;

    /**
     * HTTP 请求 Header
     */
    header?: IData;

    /**
     * 下载成功后以 tempFilePath 的形式传给页面，res = {tempFilePath: '文件的临时路径'}
     */
    success?: (res: DownloadFileResult) => void;
  }

  /**
   * 下载文件资源到本地。
   * 客户端直接发起一个 HTTP GET 请求，返回文件的本地临时路径。
   */
  export function downloadFile(options: DownloadFileOptions): downloadTask | void;

  export interface ConnectSocketOptions extends BaseOptions {
    /**
     * 开发者服务器接口地址，必须是 wss 协议，且域名必须是后台配置的合法域名
     */
    url: string;

    /**
     * 请求的数据
     */
    data?: string;

    /**
     * HTTP Header , header 中不能设置 Referer
     */
    header?: IData;

    /**
     * 默认是GET，有效值为： OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     */
    methods?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT';

    /**
     * 子协议数组
     * @version 1.4.0
     */
    protocols?: string[]
  }

  /**
   * WebSocket 任务，可通过 wx.connectSocket() 接口创建返回。
   * @version 1.7.0
   */
  export interface SocketTask extends BaseOptions {
    /**
     * 通过 WebSocket 连接发送数据。
     */
    send?: (options: SendSocketTaskOptions) => void;

    /**
     * 关闭 WebSocket 连接。
     */
    close?: (options: CloseSocketTaskOptions) => void;

    /**
     * 监听 WebSocket 连接打开事件。
     */
    onOpen?: (res: any) => void;

    /**
     * 监听 WebSocket 连接关闭事件。
     */
    onClose?: (res: any) => void;

    /**
     * 监听 WebSocket 连接打开事件。
     */
    onError?: (res: { errMsg: string }) => void;

    onMessage?: (data: { errMsg: string | ArrayBuffer }) => void;

  }

  /**
   * 创建一个 [WebSocket](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket?t=1477656499061) 连接；
   * 基础库 1.7.0 之前，一个微信小程序同时只能有一个 WebSocket 连接，如果当前已存在一个 WebSocket 连接，会自动关闭该连接，并重新创建一个 WebSocket 连接。
   * 基础库版本 1.7.0 及以后，支持存在多个 WebSokcet 连接，每次成功调用 wx.connectSocket 会返回一个新的 SocketTask。
   */
  export function connectSocket(options: ConnectSocketOptions): SocketTask;

  /**
   * 监听WebSocket连接打开事件。
   */
  export function onSocketOpen(callback: BaseCallback): void;

  /**
   * 监听WebSocket错误。
   */
  export function onSocketError(callback: BaseCallback): void;

  export interface SendSocketMessageOptions extends BaseOptions {
    /**
     * 需要发送的内容
     */
    data: string | ArrayBuffer;
  }

  /**
   * 通过 WebSocket 连接发送数据，需要先 [wx.connectSocket](#wx.connectSocket)，并在 [wx.onSocketOpen](#wx.onSocketOpen) 回调之后才能发送。
   */
  export function sendSocketMessage(options: SendSocketMessageOptions): void;

  export interface SocketMessageResponse {
    /**
     * 服务器返回的消息
     */
    data: string | any[];
  }

  /**
   * 监听WebSocket接受到服务器的消息事件。
   */
  export function onSocketMessage(callback: (res: SocketMessageResponse) => void): void;

  /**
   *
   */
  export interface CloseSocketOptions extends BaseOptions {
    /**
     * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
     * @version 1.4.0
     */
    code?: number;
    /**
     * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
     * @version 1.4.0
     */
    reason?: string
  }

  /**
   * 关闭WebSocket连接。
   */
  export function closeSocket(options: CloseSocketOptions): void;

  /**
   * 通过 WebSocket 连接发送数据, 参数。
   * @version 1.7.0
   */
  export interface SendSocketTaskOptions extends BaseOptions {
    /**
     * 需要发送的内容
     */
    data: string | ArrayBuffer
  }

  /**
   * 关闭 WebSocket 连接, 参数。
   * @version 1.7.0
   */
  export interface CloseSocketTaskOptions extends BaseOptions {
    /**
     * 一个数字值表示关闭连接的状态号，表示连接被关闭的原因。如果这个参数没有被指定，默认的取值是1000 （表示正常连接关闭）
     */
    code?: number;

    /**
     * 一个可读的字符串，表示连接被关闭的原因。这个字符串必须是不长于123字节的UTF-8 文本（不是字符）
     */
    reason?: string;
  }

  /**
   * 监听WebSocket关闭。
   * @version 1.7.0
   */
  export function onSocketClose(callback: BaseCallback): void;

  // ---------------------------------- 媒体API列表 ----------------------------------

  export interface ImageFile {
    /**
     * 本地文件路径
     */
    path: string;

    /**
     * 本地文件大小，单位：B
     */
    size: number;
  }

  export interface ChooseImageResult {
    /**
     * 本地文件路径列表
     */
    tempFilePaths: string[];

    /**
     * 图片的本地文件列表，每一项是一个 File 对象
     * @version 1.2.0
     */
    tempFiles: ImageFile[];
  }

  export interface ChooseImageOptions extends BaseOptions {
    /**
     * 最多可以选择的图片张数，默认9
     */
    count?: number;

    /**
     * original 原图，compressed 压缩图，默认二者都有
     */
    sizeType?: string[];

    /**
     * album 从相册选图，camera 使用相机，默认二者都有
     */
    sourceType?: string[];

    /**
     * 成功则返回图片的本地文件路径列表 tempFilePaths
     */
    success: (res: ChooseImageResult) => void;
  }

  /**
   * 从本地相册选择图片或使用相机拍照。
   */
  export function chooseImage(options: ChooseImageOptions): void;

  export interface PreviewImageOptions extends BaseOptions {
    /**
     * 当前显示图片的链接，不填则默认为 urls 的第一张
     */
    current?: string;

    /**
     * 需要预览的图片链接列表
     */
    urls: string[];
  }

  /**
   * 预览图片。
   */
  export function previewImage(options: PreviewImageOptions): void;

  export interface GetImageInfoResult {
    /**
     * 图片宽度，单位px
     */
    width: number;

    /**
     * 图片高度 单位px
     */
    height: number;

    /**
     * 返回图片的本地路径
     */
    path: string;
  }

  export interface GetImageInfoOptions extends BaseOptions {
    /**
     * 图片的路径，可以是相对路径，临时文件路径，存储文件路径
     */
    src: string;

    /**
     * 接口调用成功的回调函数，包含图片信息
     */
    success?: (res: GetImageInfoResult) => void;
  }

  /**
   * 获取图片信息
   */
  export function getImageInfo(options: GetImageInfoOptions): void;

  export interface SaveImageToPhotosAlbumOptions extends SuccessOptions {
    /**
     * 图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径
     */
    filePath: string;
  }

  /**
   * 保存图片到系统相册。需要用户授权 scope.writePhotosAlbum
   * @version 1.2.0
   */
  export function saveImageToPhotosAlbum(options: SaveImageToPhotosAlbumOptions): void;

  export interface StartRecordResult {
    /**
     * 录音文件的临时路径
     */
    tempFilePath: string;
  }

  export interface StartRecordOptions extends BaseOptions {
    /**
     * 录音成功后调用，返回录音文件的临时文件路径，res = {tempFilePath: '录音文件的临时路径'}
     */
    success?: (res: StartRecordResult) => void;
  }

  /**
   * 开始录音。当主动调用 `wx.stopRecord`，或者录音超过1分钟时自动结束录音，返回录音文件的临时文件路径。
   * 当用户离开小程序时，此接口无法调用。
   * 需要用户授权 scope.record
   * @deprecated 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getRecorderManager 接口
   */
  export function startRecord(options: StartRecordOptions): void;

  /**
   *​ 主动调用停止录音。
   */
  export function stopRecord(): void;

  export interface RecorderManagerStartOptions {
    /**
     * 指定录音的时长，单位 ms ，如果传入了合法的 duration ，在到达指定的 duration 后会自动停止录音，最大值 600000（10 分钟）,默认值 60000（1 分钟）
     */
    duration?: number;
    /**
     * 采样率，有效值 8000/16000/44100
     */
    sampleRate?: number;
    /**
     * 录音通道数，有效值 1/2
     */
    numberOfChannels?: number;
    /**
     * 编码码率，有效值见下表格
     */
    encodeBitRate?: number;
    /**
     * 音频格式，有效值 aac/mp3
     */
    format?: string;
    /**
     * 指定帧大小，单位 KB。传入 frameSize 后，每录制指定帧大小的内容后，会回调录制的文件内容，不指定则不会回调。暂仅支持 mp3 格式。
     */
    frameSize?: number;
  }

  export interface RecorderManagerStopCallback {
    /**
     * 录音文件的临时路径
     */
    tempFilePath: string;
  }

  export interface RecorderManagerFrameRecordedCallback {
    /**
     * 录音分片结果数据
     */
    frameBuffer: ArrayBuffer;
    /**
     * 当前帧是否正常录音结束前的最后一帧
     */
    isLastFrame: boolean;
  }

  export interface RecorderManagerErrorCallback {
    /**
     * 错误信息
     */
    errMsg: string;
  }

  /**
   * 全局唯一的录音管理器
   */
  export interface recorderManager {
    /**
     * 开始录音
     * @param {wx.RecorderManagerStartOptions} options
     */
    start(options: RecorderManagerStartOptions): void;

    /**
     * 暂停录音
     */
    pause(): void;

    /**
     * 继续录音
     */
    resume(): void;

    /**
     * 停止录音
     */
    stop(): void;

    /**
     * 录音开始事件
     * @param {BaseCallback} callback
     */
    onStart(callback: BaseCallback): void;

    /**
     * 录音暂停事件
     * @param {BaseCallback} callback
     */
    onPause(callback: BaseCallback): void;

    /**
     * 录音停止事件，会回调文件地址
     * @param {RecorderManagerStopCallback} callback
     */
    onStop(callback: (res: RecorderManagerStopCallback) => void): void;

    /**
     * 已录制完指定帧大小的文件，会回调录音分片结果数据。如果设置了 frameSize ，则会回调此事件
     * @param {RecorderManagerFrameRecordedCallback} callback
     */
    onFrameRecorded(callback: (res: RecorderManagerFrameRecordedCallback) => void): void;

    /**
     * 录音错误事件, 会回调错误信息
     * @param {RecorderManagerErrorCallback} callback
     */
    onError(callback: (res: RecorderManagerErrorCallback) => void): void;
  }

  /**
   * 获取全局唯一的录音管理器 recorderManager。
   * @version 1.6.0
   * @returns recorderManager
   */
  export function getRecorderManager(): recorderManager;

  export interface PlayVoiceOptions extends BaseOptions {
    /**
     * 需要播放的语音文件的文件路径
     */
    filePath: string;
    /**
     * 指定录音时长，到达指定的录音时长后会自动停止录音，单位：秒，默认值：60
     * @version 1.6.0
     */
    duration?: number
  }

  /**
   * 开始播放语音，同时只允许一个语音文件正在播放，如果前一个语音文件还没播放完，将中断前一个语音播放。
   * @deprecated 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
   */
  export function playVoice(options: PlayVoiceOptions): void;

  /**
   * 暂停正在播放的语音。
   * 再次调用wx.playVoice播放同一个文件时，会从暂停处开始播放。如果想从头开始播放，需要先调用 wx.stopVoice。
   */
  export function pauseVoice(): void;

  /**
   * 结束播放语音。
   */
  export function stopVoice(): void;

  export interface GetBackgroundAudioPlayerStateResult {
    /**
     * 选定音频的长度（单位：s），只有在当前有音乐播放时返回
     */
    duration: number;

    /**
     * 选定音频的播放位置（单位：s），只有在当前有音乐播放时返回
     */
    currentPosition: number;

    /**
     * 播放状态（2：没有音乐在播放，1：播放中，0：暂停中）
     */
    status: number;

    /**
     * 音频的下载进度（整数，80 代表 80%），只有在当前有音乐播放时返回
     */
    downloadPercent: number;

    /**
     * 歌曲数据链接，只有在当前有音乐播放时返回
     */
    dataUrl: string;
  }

  export interface GetBackgroundAudioPlayerStateOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: GetBackgroundAudioPlayerStateResult) => void;
  }

  /**
   * 获取后台音乐播放状态。
   * @deprecated 注意：1.2.0 版本开始，本接口不再维护。建议使用能力更强的 wx.getBackgroundAudioManager 接口
   */
  export function getBackgroundAudioPlayerState(options: GetBackgroundAudioPlayerStateOptions): void;

  export interface PlayBackgroundAudioOptions extends BaseOptions {
    /**
     * 音乐链接, 目前支持的格式有 m4a, aac, mp3, wav
     */
    dataUrl: string;

    /**
     * 音乐标题
     */
    title?: string;

    /**
     * 封面URL
     */
    coverImgUrl?: string;
  }

  /**
   * 使用后台播放器播放音乐，对于微信客户端来说，只能同时有一个后台音乐在播放。
   * 当用户离开小程序后，音乐将暂停播放；
   * 当用户点击“显示在聊天顶部”时，音乐不会暂停播放；
   * 当用户在其他小程序占用了音乐播放器，原有小程序内的音乐将停止播放。
   */
  export function playBackgroundAudio(options: PlayBackgroundAudioOptions): void;

  /**
   * 暂停播放音乐。
   */
  export function pauseBackgroundAudio(): void;

  export interface SeekBackgroundAudioOptions extends BaseOptions {
    /**
     * 音乐位置，单位：秒
     */
    position: number;
  }

  /**
   * 控制音乐播放进度。
   */
  export function seekBackgroundAudio(options: SeekBackgroundAudioOptions): void;

  /**
   * 停止播放音乐。
   */
  export function stopBackgroundAudio(): void;

  /**
   * 监听音乐播放。
   */
  export function onBackgroundAudioPlay(callback: BaseCallback): void;

  /**
   * 监听音乐暂停。
   */
  export function onBackgroundAudioPause(callback: BaseCallback): void;

  /**
   * 监听音乐停止。
   */
  export function onBackgroundAudioStop(callback: BaseCallback): void;

  export interface backgroundAudioManager {
    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     */
    readonly duration: number;
    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回
     */
    readonly currentTime: number;
    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     */
    readonly paused: Boolean;
    /**
     * 音频的数据源，默认为空字符串，当设置了新的 src 时，会自动开始播放 ，目前支持的格式有 m4a, aac, mp3, wav
     */
    src: string;
    /**
     * 音频开始播放的位置（单位：s）
     */
    startTime: number;
    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
     */
    buffered: number;
    /**
     * 音频标题，用于做原生音频播放器音频标题。原生音频播放器中的分享功能，分享出去的卡片标题，也将使用该值。
     */
    title: number;
    /**
     * 专辑名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     */
    epname: string;
    /**
     * 歌手名，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     */
    singer: string;
    /**
     * 封面图url，用于做原生音频播放器背景图。原生音频播放器中的分享功能，分享出去的卡片配图及背景也将使用该图。
     */
    coverImgUrl: string;
    /**
     * 页面链接，原生音频播放器中的分享功能，分享出去的卡片简介，也将使用该值。
     */
    webUrl: string;

    /**
     * 播放
     */
    play(): void;

    /**
     * 暂停
     */
    pause(): void;

    /**
     * 停止
     */
    stop(): void;

    /**
     * 跳转到指定位置，单位 s
     * @param {number} position
     */
    seek(position: number): void;

    /**
     * 背景音频进入可以播放状态，但不保证后面可以流畅播放
     * @param {BaseCallback} callback
     */
    onCanplay(callback: BaseCallback): void;

    /**
     * 背景音频播放事件
     * @param {BaseCallback} callback
     */
    onPlay(callback: BaseCallback): void;

    /**
     * 背景音频暂停事件
     * @param {BaseCallback} callback
     */
    onPause(callback: BaseCallback): void;

    /**
     * 背景音频停止事件
     * @param {BaseCallback} callback
     */
    onStop(callback: BaseCallback): void;

    /**
     * 背景音频自然播放结束事件
     * @param {BaseCallback} callback
     */
    onEnded(callback: BaseCallback): void;

    /**
     * 背景音频播放进度更新事件
     * @param {BaseCallback} callback
     */
    onTimeUpdate(callback: BaseCallback): void;

    /**
     * 用户在系统音乐播放面板点击上一曲事件（iOS only）
     * @param {BaseCallback} callback
     */
    onPrev(callback: BaseCallback): void;

    /**
     * 用户在系统音乐播放面板点击下一曲事件（iOS only）
     * @param {BaseCallback} callback
     */
    onNext(callback: BaseCallback): void;

    /**
     * 背景音频播放错误事件
     * @param {BaseCallback} callback
     */
    onError(callback: BaseCallback): void;

    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     * @param {BaseCallback} callback
     */
    onWaiting(callback: BaseCallback): void;
  }

  /**
   * 获取全局唯一的背景音频管理器
   * @returns backgroundAudioManager
   */
  export function getBackgroundAudioManager(): backgroundAudioManager;

  /**
   * `audioContext` 通过 audioId 跟一个 audio 组件绑定，通过它可以操作一个 audio 组件。
   */
  export interface AudioContext {

    /**
     * 音频的地址
     * @param {string} src
     */
    setSrc(src: string): void;

    /**
     * 播放
     */
    play(): void;

    /**
     * 暂停
     */
    pause(): void;

    /**
     * 跳转到指定位置，单位 s
     * @param {number} position
     */
    seek(position: number): void;
  }

  /**
   * 创建并返回 audio 上下文 audioContext 对象。
   * 在自定义组件下，第二个参数传入组件实例this，以操作组件内 <audio/> 组件
   * @deprecated 注意：1.6.0 版本开始，本接口不再维护。建议使用能力更强的 wx.createInnerAudioContext 接口
   */
  export function createAudioContext(audioId: string): AudioContext;


  export interface innerAudioContext {
    /**
     * 音频的数据链接，用于直接播放。
     */
    src: string;
    /**
     * 开始播放的位置（单位：s），默认 0
     */
    startTime: number;
    /**
     * 是否自动开始播放，默认 false
     */
    autoplay: boolean;
    /**
     * 是否循环播放，默认 false
     */
    loop: boolean;
    /**
     * 是否遵循系统静音开关，当此参数为 false 时，即使用户打开了静音开关，也能继续发出声音，默认值 true
     */
    obeyMuteSwitch: boolean;
    /**
     * 当前音频的长度（单位：s），只有在当前有合法的 src 时返回
     */
    readonly duration: number;
    /**
     * 当前音频的播放位置（单位：s），只有在当前有合法的 src 时返回，时间不取整，保留小数点后 6 位
     */
    readonly currentTime: number;
    /**
     * 当前是是否暂停或停止状态，true 表示暂停或停止，false 表示正在播放
     */
    readonly paused: boolean;
    /**
     * 音频缓冲的时间点，仅保证当前播放时间点到此时间点内容已缓冲。
     */
    readonly buffered: number;

    /**
     * 播放
     */
    play(): void;

    /**
     * 暂停
     */
    pause(): void;

    /**
     * 停止
     */
    stop(): void;

    /**
     * 跳转到指定位置，单位 s
     * @param {number} position
     */
    seek(position: number): void;

    /**
     * 销毁当前实例
     */
    destroy(): void;

    /**
     * 背景音频进入可以播放状态，但不保证后面可以流畅播放
     * @param {BaseCallback} callback
     */
    onCanplay(callback: BaseCallback): void;

    /**
     * 背景音频播放事件
     * @param {BaseCallback} callback
     */
    onPlay(callback: BaseCallback): void;

    /**
     * 背景音频暂停事件
     * @param {BaseCallback} callback
     */
    onPause(callback: BaseCallback): void;

    /**
     * 背景音频停止事件
     * @param {BaseCallback} callback
     */
    onStop(callback: BaseCallback): void;

    /**
     * 背景音频自然播放结束事件
     * @param {BaseCallback} callback
     */
    onEnded(callback: BaseCallback): void;

    /**
     * 背景音频播放进度更新事件
     * @param {BaseCallback} callback
     */
    onTimeUpdate(callback: BaseCallback): void;

    /**
     * 背景音频播放错误事件
     * @param {BaseCallback} callback
     */
    onError(callback: BaseCallback): void;

    /**
     * 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
     * @param {BaseCallback} callback
     */
    onWaiting(callback: BaseCallback): void;

    /**
     * 音频进行 seek 操作事件
     * @param {BaseCallback} callback
     */
    onSeeking(callback: BaseCallback): void;

    /**
     * 音频完成 seek 操作事件
     * @param {BaseCallback} callback
     */
    onSeeked(callback: BaseCallback): void;
  }

  /**
   * 创建并返回内部 audio 上下文 innerAudioContext 对象。
   * 本接口是 wx.createAudioContext 升级版。
   * @version 1.6.0
   */
  export function createInnerAudioContext(): innerAudioContext;

  export interface ChooseVideoResult {
    /**
     * 选定视频的临时文件路径
     */
    tempFilePath: string;

    /**
     * 选定视频的时间长度
     */
    duration: number;

    /**
     * 选定视频的数据量大小
     */
    size: number;

    /**
     * 返回选定视频的长
     */
    height: number;

    /**
     * 返回选定视频的宽
     */
    width: number;
  }

  export interface ChooseVideoOptions extends BaseOptions {
    /**
     * album 从相册选视频，camera 使用相机拍摄，默认为：['album', 'camera']
     */
    sourceType?: string[];
    /**
     * 是否压缩所选的视频源文件，默认值为true，需要压缩
     */
    compressed: boolean;
    /**
     * 拍摄视频最长拍摄时间，单位秒。最长支持60秒
     */
    maxDuration?: number;
    /**
     * 前置或者后置摄像头，默认为前后都有，即：['front', 'back']
     */
    camera?: string[];

    /**
     * 接口调用成功，返回视频文件的临时文件路径
     */
    success?: (res: ChooseVideoResult) => void;
  }

  /**
   * 拍摄视频或从手机相册中选视频，返回视频的临时文件路径。
   */
  export function chooseVideo(options: ChooseVideoOptions): void;

  export interface SaveVideoToPhotosAlbumOptions extends SuccessOptions {
    /**
     * 视频文件路径，可以是临时文件路径也可以是永久文件路径
     */
    filePath: string;
  }

  /**
   * 保存视频到系统相册。需要用户授权 scope.writePhotosAlbum
   * @param {SaveVideoToPhotosAlbumOptions} options
   * @version 1.2.0
   */
  export function saveVideoToPhotosAlbum(options: SaveVideoToPhotosAlbumOptions): void;

  /**
   * `videoContext` 通过 videoId 跟一个 video 组件绑定，通过它可以操作一个 video 组件。
   */
  export interface VideoContext {
    /**
     * 播放
     */
    play(): void;

    /**
     * 暂停
     */
    pause(): void;

    /**
     * 跳转到指定位置，单位 s
     * @param {number} position
     */
    seek(position: number): void;

    /**
     * 发送弹幕，danmu 包含两个属性 text, color
     * @param {{text: string, color: string}} danmu
     */
    sendDanmu(danmu: { text: string; color: string }): void;

    /**
     * 设置倍速播放，支持的倍率有 0.5/0.8/1.0/1.25/1.5  1.4.0
     * @param {number} rate
     */
    playbackRate(rate: number): void;

    /**
     * 进入全屏
     * @param {number} direction 1.7.0起支持
     * @version 1.4.0
     */
    requestFullScreen(direction: number): void;

    /**
     * 退出全屏
     */
    exitFullScreen(): void;
  }

  /**
   * 创建并返回 video 上下文 videoContext 对象。在自定义组件下，第二个参数传入组件实例this，以操作组件内 <video/> 组件
   */
  export function createVideoContext(videoId: string): VideoContext;

  export interface cameraContextTakePhoto extends BaseOptions {
    /**
     * 成像质量，值为high, normal, low，默认normal
     */
    quality?: string;
    /**
     * 接口调用成功的回调函数
     * @param {{tempImagePath: string}} res
     */
    success?: (res: { tempImagePath: string }) => void;
  }

  export interface cameraContextStartRecord extends BaseOptions {
    /**
     * 超过30s或页面onHide时会结束录像
     * @param {{tempThumbPath: string, tempVideoPath: string}} res
     */
    timeoutCallback?: (res: { tempThumbPath: string, tempVideoPath: string }) => void;
  }

  export interface cameraContextStopRecord extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     * @param {{tempThumbPath: string, tempVideoPath: string}} res
     */
    success?: (res: { tempThumbPath: string, tempVideoPath: string }) => void;
  }

  export interface cameraContext {
    /**
     * 拍照，可指定质量，成功则返回图片
     */
    takePhoto(options: cameraContextTakePhoto): void;

    /**
     * 开始录像
     */
    startRecord(options: cameraContextStartRecord): void;

    /**
     * 结束录像，成功则返回封面与视频
     */
    stopRecord(options: cameraContextStopRecord): void;
  }

  /**
   * 创建并返回 camera 上下文 cameraContext 对象，cameraContext 与页面的 camera 组件绑定，
   * 一个页面只能有一个camera，通过它可以操作对应的 <camera/> 组件。
   * 在自定义组件下，第一个参数传入组件实例this，以操作组件内 <camera/> 组件
   * @version 1.6.0
   * @param context 当前组件实例
   * @returns {wx.cameraContext}
   */
  export function createCameraContext(context: any): cameraContext;

  export interface livePlayerContextRequestFullScreenOptions extends BaseOptions {
    /**
     * 有效值为 0（正常竖向）, 90（屏幕逆时针90度）, -90（屏幕顺时针90度）
     */
    direction?: number;
  }

  export interface livePlayerContext {
    /**
     * 播放
     */
    play(options: BaseOptions): void;

    /**
     * 停止
     */
    stop(options: BaseOptions): void;

    /**
     * 静音
     */
    mute(options: BaseOptions): void;

    /**
     * 进入全屏
     * @param {wx.livePlayerContextRequestFullScreenOptions} options
     */
    requestFullScreen(options: livePlayerContextRequestFullScreenOptions): void;

    /**
     * 退出全屏
     */
    exitFullScreen(options: BaseOptions): void;
  }

  /**
   * 操作对应的 <live-player/> 组件。
   * 创建并返回 live-player 上下文 LivePlayerContext 对象。
   * 在自定义组件下，第二个参数传入组件实例this，以操作组件内 <live-player/> 组件
   * @param {number} domId
   * @param context 当前组件实例
   * @returns {wx.livePlayerContext}
   * @version 1.7.0
   */
  export function createLivePlayerContext(domId: number, context: any): livePlayerContext;

  export interface livePusherContext {
    /**
     * 播放推流
     */
    play(options: BaseOptions): void;

    /**
     * 停止推流
     */
    stop(options: BaseOptions): void;

    /**
     * 暂停推流
     */
    pause(options: BaseOptions): void;

    /**
     * 恢复推流
     */
    resume(options: BaseOptions): void;

    /**
     * 切换前后摄像头
     */
    switchCamera(options: BaseOptions): void;
  }

  /**
   * 创建并返回 live-pusher 上下文 LivePusherContext 对象，
   * LivePusherContext 与页面的 <live-pusher /> 组件绑定，一个页面只能有一个 live-pusher，
   * 通过它可以操作对应的 <live-pusher/> 组件。
   * 在自定义组件下，第一个参数传入组件实例this，以操作组件内 <live-pusher/> 组件
   * @param context 当前组件实例
   * @returns {wx.livePusherContext}
   * @version 1.7.0
   */
  export function createLivePusherContext(context: any): livePusherContext;

  export interface SaveFileOptions extends BaseOptions {
    /**
     * 需要保存的文件的临时路径
     */
    tempFilePath: string;

    /**
     * 返回文件的保存路径
     * @param {{savedFilePath: string}} res 文件的保存路径
     */
    success?: (res: { savedFilePath: string }) => void;
  }

  /**
   * 保存文件到本地。
   * 注意：saveFile 会把临时文件移动，因此调用成功后传入的 tempFilePath 将不可用
   * @param {wx.SaveFileOptions} options
   */
  export function saveFile(options: SaveFileOptions): void;

  export interface FileListItem {
    /**
     * 文件的本地路径
     */
    filePath: string;

    /**
     * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
     */
    createTime: number;

    /**
     * 文件大小，单位B
     */
    size: number;
  }

  export interface GetSavedFileListResult {
    /**
     * 接口调用结果
     */
    errMsg: string;

    /**
     * 文件列表
     */
    fileList: FileListItem[];
  }

  export interface GetSavedFileListOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: GetSavedFileListResult) => void;
  }

  /**
   * 获取本地已保存的文件列表
   * @param {wx.GetSavedFileListOptions} options
   */
  export function getSavedFileList(options: GetSavedFileListOptions): void;

  export interface GetSavedFileInfoResult {
    /**
     * 接口调用结果
     */
    errMsg: string;

    /**
     * 文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
     */
    createTime: number;

    /**
     * 文件大小，单位B
     */
    size: number;
  }

  export interface GetSavedFileInfoOptions extends BaseOptions {
    /**
     * 文件路径
     */
    filePath: string;

    /**
     * 接口调用成功的回调函数
     */
    success?: (res: GetSavedFileInfoResult) => void;
  }

  /**
   * 获取本地文件的文件信息
   * 此接口只能用于获取已保存到本地的文件，若需要获取临时文件信息，请使用 wx.getFileInfo 接口。
   * @param {wx.GetSavedFileInfoOptions} options
   */
  export function getSavedFileInfo(options: GetSavedFileInfoOptions): void;

  export interface RemoveSavedFileOptions extends BaseOptions {
    /**
     * 需要删除的文件路径
     */
    filePath: string;
  }

  /**
   * 删除本地存储的文件
   * @param {wx.RemoveSavedFileOptions} options
   */
  export function removeSavedFile(options: RemoveSavedFileOptions): void;

  export interface OpenDocumentOptions extends BaseOptions {
    /**
     * 文件路径，可通过 downFile 获得
     */
    filePath: string;
    /**
     * 文件类型，指定文件类型打开文件，有效值 doc, xls, ppt, pdf, docx, xlsx, pptx
     * @version 1.4.0
     */
    fileType?: string
  }

  /**
   * 新开页面打开文档，支持格式：doc, xls, ppt, pdf, docx, xlsx, pptx
   * @param {wx.OpenDocumentOptions} options
   */
  export function openDocument(options: OpenDocumentOptions): void;

  // ---------------------------------- 数据API列表 ----------------------------------

  export interface SetStorageOptions extends BaseOptions {
    /**
     * 本地缓存中的指定的 key
     */
    key: string;

    /**
     * 需要存储的内容
     */
    data: IData | string;
  }

  /**
   * 将数据存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个异步接口。
   * @param {wx.SetStorageOptions} options
   */
  export function setStorage(options: SetStorageOptions): void;

  /**
   * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
   * @param {string} key
   * @param {wx.IData | string} data
   */
  export function setStorageSync(key: string, data: IData | string): void;

  export interface GetStorageOptions extends SuccessOptions {
    /**
     * 本地缓存中的指定的 key
     */
    key: string;
  }

  /**
   * 从本地缓存中异步获取指定 key 对应的内容。
   * @param {wx.GetStorageOptions} options
   */
  export function getStorage(options: GetStorageOptions): void;

  /**
   * 从本地缓存中同步获取指定 key 对应的内容。
   * @param {string} key
   * @returns any
   */
  export function getStorageSync(key: string): any;

  export interface GetStorageInfoResult {
    /**
     * 当前storage中所有的key
     */
    keys: string[];

    /**
     * 当前占用的空间大小, 单位kb
     */
    currentSize: number;

    /**
     * 限制的空间大小，单位kb
     */
    limitSize: number;
  }

  export interface GetStorageInfoOptions extends BaseOptions {
    /**
     * 接口调用的回调函数
     */
    success?: (res: GetStorageInfoResult) => void;
  }

  /**
   * 从本地缓存中异步获取指定 key 对应的内容。
   * @param {wx.GetStorageInfoOptions} options
   */
  export function getStorageInfo(options: GetStorageInfoOptions): void;

  /**
   * 从本地缓存中同步获取指定 key 对应的内容。
   * @returns {wx.GetStorageInfoResult}
   */
  export function getStorageInfoSync(): GetStorageInfoResult;

  export interface RemoveStorageOptions extends BaseOptions {
    /**
     * 本地缓存中的指定的 key
     */
    key: string;

    /**
     * 接口调用的回调函数
     */
    success: () => void;
  }

  /**
   * 从本地缓存中异步移除指定 key 。
   * @param {wx.RemoveStorageOptions} options
   */
  export function removeStorage(options: RemoveStorageOptions): void;

  /**
   * 从本地缓存中同步移除指定 key 。
   * @param {string} key
   */
  export function removeStorageSync(key: string): void;

  /**
   * 清理本地数据缓存。
   */
  export function clearStorage(): void;

  /**
   * 同步清理本地数据缓存。
   */
  export function clearStorageSync(): void;

  // ---------------------------------- 位置API列表 ----------------------------------

  export interface Location {
    /**
     * 纬度，浮点数，范围为-90~90，负数表示南纬
     */
    latitude: number;

    /**
     * 经度，浮点数，范围为-180~180，负数表示西经
     */
    longitude: number;
  }

  export interface GetLocationResult extends Location {
    /**
     * 速度，浮点数，单位m/s
     */
    speed: number;

    /**
     * 位置的精确度
     */
    accuracy: number;
    /**
     * 高度，单位 m
     * @version 1.2.0
     */
    altitude: number;

    /**
     * 垂直精度，单位 m（Android 无法获取，返回 0）
     * @version 1.2.0
     */
    verticalAccuracy: number;

    /**
     * 水平精度，单位 m
     * @version 1.2.0
     */
    horizontalAccuracy: number;
  }

  export interface GetLocationOptions extends BaseOptions {
    /**
     * 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 `wx.openLocation` 的坐标
     */
    type?: string;

    /**
     * 传入 true 会返回高度信息，由于获取高度需要较高精确度，会减慢接口返回速度
     * @version 1.6.0
     */
    altitude: boolean;
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: GetLocationResult) => void;
  }

  /**
   * 获取当前的地理位置、速度。
   * 当用户离开小程序后，此接口无法调用；
   * 当用户点击“显示在聊天顶部”时，此接口可继续调用。
   * @param {wx.GetLocationOptions} options
   */
  export function getLocation(options: GetLocationOptions): void;

  export interface ChooseLocationResult extends Location {
    /**
     * 位置名称
     */
    name: string;

    /**
     * 详细地址
     */
    address: string;
  }

  export interface ChooseLocationOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: ChooseLocationResult) => void;
  }

  /**
   * 打开地图选择位置
   * 需要用户授权 scope.userLocation
   * @param {wx.ChooseLocationOptions} options
   */
  export function chooseLocation(options: ChooseLocationOptions): void;

  export interface OpenLocationOptions extends BaseOptions, Location {
    /**
     * 缩放比例，范围1~28，默认为28
     */
    scale?: number;

    /**
     * 位置名
     */
    name?: string;

    /**
     * 地址的详细说明
     */
    address?: string;
  }

  /**
   * 使用微信内置地图查看位置
   * 需要用户授权 scope.userLocation
   * @param {wx.OpenLocationOptions} options
   */
  export function openLocation(options: OpenLocationOptions): void;

  export interface GetCenterLocationOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数 ，res = { longitude: "经度", latitude: "纬度"}
     */
    success?: (res: Location) => void;
  }

  export interface MapTranslateMarkerOptions {
    /**
     *  指定marker
     */
    markerId: number;
    /**
     * 指定marker移动到的目标点
     */
    destination: Location;
    /**
     * 移动过程中是否自动旋转marker
     */
    autoRotate: boolean;
    /**
     *  marker的旋转角度
     */
    rotate: number;
    /**
     * 动画持续时长，默认值1000ms，平移与旋转分别计算
     */
    duration?: number;
    /**
     * 动画结束回调函数
     */
    animationEnd?: BaseCallback;
    /**
     * 接口调用失败的回调函数
     */
    fail?: BaseCallback
  }

  export interface MapIncludePointsOptions {
    /**
     * 要显示在可视区域内的坐标点列表
     */
    points: Location[];
    /**
     *  坐标点形成的矩形边缘到地图边缘的距离，单位像素。
     *  格式为[上,右,下,左]，安卓上只能识别数组第一项，上下左右的padding一致。
     *  开发者工具暂不支持padding参数。
     */
    padding?: any[]
  }

  export interface MapGetRegionOptions extends BaseOptions {
    /**
     *  接口调用成功的回调函数，，西南角与东北角的经纬度
     * @param {{southwest: number, northeast: number}} res
     */
    success?: (res: { southwest: number, northeast: number }) => void;
  }

  export interface MapGetScaleOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     * @param {{scale: number}} res
     */
    success(res: { scale: number }): void;
  }

  /**
   * mapContext 通过 mapId 跟一个 <map/> 组件绑定，通过它可以操作对应的 <map/> 组件。
   */
  export interface MapContext {
    /**
     * 获取当前地图中心的经纬度，返回的是 gcj02 坐标系，可以用于 wx.openLocation
     */
    getCenterLocation(options: GetCenterLocationOptions): void;

    /**
     * 将地图中心移动到当前定位点，需要配合map组件的show-location使用
     */
    moveToLocation(): void;

    /**
     * 平移marker，带动画
     * @param {wx.MapTranslateMarkerOptions} options
     * @version 1.2.0
     */
    translateMarker(options: MapTranslateMarkerOptions): void;

    /**
     * 缩放视野展示所有经纬度
     * @param {wx.MapIncludePointsOptions} options
     * @version 1.2.0
     */
    includePoints(options: MapIncludePointsOptions): void;

    /**
     * 获取当前地图的视野范围
     * @param {wx.MapGetRegionOptions} options
     * @version 1.4.0
     */
    getRegion(options: MapGetRegionOptions): void;

    /**
     * 获取当前地图的缩放级别
     * @param {wx.MapGetScaleOptions} options
     * @version 1.4.0
     */
    getScale(options: MapGetScaleOptions): void;
  }

  /**
   * 创建并返回 map 上下文 mapContext 对象
   * 在自定义组件下，第二个参数传入组件实例this，以操作组件内 <map/> 组件
   * @param {string} mapId
   * @param context
   * @returns {wx.MapContext}
   */
  export function createMapContext(mapId: string, context: any): MapContext;

  // ---------------------------------- 设备API列表 ----------------------------------

  export interface GetSystemInfoResult {
    /**
     * 手机品牌
     * @version 1.5.0
     */
    brand: string;
    /**
     * 手机型号
     */
    model: string;

    /**
     * 设备像素比
     */
    pixelRatio: number;
    /**
     * 屏幕宽度
     * @version 1.1.0
     */
    screenWidth: number;
    /**
     * 屏幕高度
     * @version 1.1.0
     */
    screenHeight: number;

    /**
     * 窗口宽度
     */
    windowWidth: number;

    /**
     * 窗口高度
     */
    windowHeight: number;

    /**
     * 微信设置的语言
     */
    language: string;

    /**
     * 微信版本号
     */
    version: string;

    /**
     * 操作系统版本
     */
    system: string;

    /**
     * 客户端平台
     */
    platform: string;
    /**
     * 用户字体大小设置。以“我-设置-通用-字体大小”中的设置为准，单位：px
     * @version 1.5.0
     */
    fontSizeSetting: number;
    /**
     * 客户端基础库版本
     * @version 1.1.0
     */
    SDKVersion: number
  }

  export interface GetSystemInfoOptions extends BaseOptions {
    /**
     * 接口调用成功的回调
     */
    success?: (res: GetSystemInfoResult) => void;
  }

  /**
   * 获取系统信息。
   */
  export function getSystemInfo(options: GetSystemInfoOptions): void;

  /**
   * 获取系统信息同步接口
   */
  export function getSystemInfoSync(): GetSystemInfoResult;

  /**
   * 判断小程序的API，回调，参数，组件等是否在当前版本可用。
   * 参数说明： 使用${API}.${method}.${param}.${options}或者${component}.${attribute}.${option}方式来调用
   * @param {string} args
   * @returns {boolean}
   */
  export function canIUse(args: string): boolean;

  export interface GetNetworkTypeResult {
    /**
     * 网络类型
     */
    networkType: "2g" | "3g" | "4g" | "wifi" | "none" | "unknown";
  }

  export interface GetNetworkTypeOptions extends BaseOptions {
    /**
     * 接口调用成功，返回网络类型 networkType
     */
    success?: (res: GetNetworkTypeResult) => void;
  }

  /**
   * 获取网络类型。
   */
  export function getNetworkType(options: GetNetworkTypeOptions): void;

  export interface OnNetworkStatusChangeResult {
    /**
     * 当前是否有网络连接
     */
    isConnected: boolean;
    /**
     * 网络类型
     */
    networkType: "2g" | "3g" | "4g" | "wifi" | "none" | "unknown";
  }

  /**
   * 监听网络状态变化。
   * @version 1.1.0
   */
  export function onNetworkStatusChange(callback: (res: OnNetworkStatusChangeResult) => void): void;


  export interface AccelerometerChangeResponse {
    /**
     * X 轴
     */
    x: number;

    /**
     * Y 轴
     */
    y: number;

    /**
     * Z 轴
     */
    z: number;
  }

  /**
   * 监听重力感应数据，频率：5次/秒
   */
  export function onAccelerometerChange(callback: (res: AccelerometerChangeResponse) => void): void;

  export interface CompassChangeResponse {
    /**
     * 面对的方向度数
     */
    direction: number;
  }

  /**
   * 监听罗盘数据，频率：5次/秒
   */
  export function onCompassChange(callback: (res: CompassChangeResponse) => void): void;

  export interface MakePhoneCallOptions {
    /**
     * 需要拨打的电话号码
     */
    phoneNumber: string;
  }

  /**
   * 拨打电话
   */
  export function makePhoneCall(options: MakePhoneCallOptions): void;

  export interface ScanCodeResult {
    /**
     * 码的内容
     */
    result: string;

    /**
     * 所扫码的类型
     */
    scanType: string;

    /**
     * 所扫码的字符集
     */
    charSet: string;

    /**
     * 当所扫的码为当前小程序的合法二维码时，会返回此字段，内容为二维码携带的 path
     */
    path: string;
  }

  export interface ScanCodeOptions extends BaseOptions {
    /**
     * 是否只能从相机扫码，不允许从相册选择图片
     * @version 1.2.0
     */
    onlyFromCamera: boolean;
    /**
     * 扫码类型，参数类型是数组，二维码是'qrCode'，一维码是'barCode'，DataMatrix是‘datamatrix’，pdf417是‘pdf417’。
     * @version 1.7.0
     */
    scanType: string[];
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: ScanCodeResult) => void;
  }

  /**
   * 调起客户端扫码界面，扫码成功后返回对应的结果
   */
  export function scanCode(options: ScanCodeOptions): void;

  export interface SetClipboardDataOptions extends BaseOptions {
    /**
     * 需要设置剪贴板的内容
     */
    data: string;
  }

  /**
   * 设置系统剪贴板的内容
   * @param {SetClipboardDataOptions} options
   * @version 1.1.0
   */
  export function setClipboardData(options: SetClipboardDataOptions): void;

  /**
   * 获取系统剪贴板内容
   * @param {wx.SuccessOptions} options
   * @version 1.1.0
   */
  export function getClipboardData(options: SuccessOptions): void;

  // ---------------------------------- 界面API列表 ----------------------------------

  export interface ShowToastOptions extends BaseOptions {
    /**
     * 提示的内容
     */
    title: string;

    /**
     * 图标，只支持"success"、"loading"
     * 'none' @version 1.9.0
     */
    icon?: "success" | "loading" | 'none';

    /**
     * 自定义图标的本地路径，image 的优先级高于 icon
     */
    image?: string;

    /**
     * 提示的延迟时间，单位毫秒，默认：1500, 最大为10000
     */
    duration?: number;

    /**
     * 是否显示透明蒙层，防止触摸穿透，默认：false
     */
    mask?: boolean;
  }

  /**
   * 显示消息提示框
   */
  export function showToast(options: ShowToastOptions): void;

  export interface ShowLoadingOptions extends BaseOptions {
    /**
     * 提示的内容
     */
    title: string;
    /**
     * 是否显示透明蒙层，防止触摸穿透，默认：false
     */
    mask?: boolean;
  }

  /**
   * 显示 loading 提示框, 需主动调用 wx.hideLoading 才能关闭提示框
   * @param {ShowLoadingOptions} options
   * @version 1.1.0
   */
  export function showLoading(options: ShowLoadingOptions): void;

  /**
   * 隐藏消息提示框
   */
  export function hideToast(): void;

  /**
   * 隐藏 loading 提示框
   * @version 1.1.0
   */
  export function hideLoading(): void;

  export interface ShowModalResult {
    /**
     * confirm==1时，表示用户点击确定按钮
     */
    confirm: number;
    /**
     * 为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）
     */
    cancel: boolean;
  }

  export interface ShowModalOptions extends BaseOptions {
    /**
     * 提示的标题
     */
    title: string;

    /**
     * 提示的内容
     */
    content: string;

    /**
     * 是否显示取消按钮，默认为 true
     */
    showCancel?: boolean;

    /**
     * 取消按钮的文字，默认为"取消",最多 4 个字符
     */
    cancelText?: string;

    /**
     * 取消按钮的文字颜色，默认为"#000000"
     */
    cancelColor?: string;

    /**
     * 确定按钮的文字，默认为"确定",最多 4 个字符
     */
    confirmText?: string;

    /**
     * 确定按钮的文字颜色，默认为"#3CC51F"
     */
    confirmColor?: string;

    /**
     * 接口调用成功的回调函数，返回res.confirm==1时，表示用户点击确定按钮
     */
    success?: (res?: ShowModalResult) => void;
  }

  /**
   * 显示消息提示框
   */
  export function showModal(options: ShowModalOptions): void;

  export interface ShowActionSheetResult {
    /**
     * 用户是否取消选择
     */
    cancel: boolean;

    /**
     * 用户点击的按钮，从上到下的顺序，从0开始
     */
    tapIndex: number;
  }

  export interface ShowActionSheetOptions extends BaseOptions {
    /**
     * 按钮的文字数组，数组长度最大为6个
     */
    itemList: string[];

    /**
     * 按钮的文字颜色，默认为"#000000"
     */
    itemColor?: string;

    /**
     * 接口调用成功的回调函数
     */
    success?: (res: ShowActionSheetResult) => void;
  }

  /**
   * 显示操作菜单
   */
  export function showActionSheet(options: ShowActionSheetOptions): void;

  export interface SetNavigationBarTitleOptions extends BaseOptions {
    /**
     * 页面标题
     */
    title: string;
  }

  /**
   * 动态设置当前页面的标题。
   */
  export function setNavigationBarTitle(options: SetNavigationBarTitleOptions): void;

  /**
   * 在当前页面显示导航条加载动画。
   */
  export function showNavigationBarLoading(): void;

  /**
   * 隐藏导航条加载动画。
   */
  export function hideNavigationBarLoading(): void;

  export interface SetNavigationBarColorAnimation {
    /**
     * 动画变化时间，默认0，单位：毫秒
     */
    duration: number;
    /**
     * 动画变化方式，默认 linear
     * linear  动画从头到尾的速度是相同的。
     * easeIn  动画以低速开始
     * easeOut  动画以低速结束。
     * easeInOut  动画以低速开始和结束。
     */
    timingFunc: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  }

  export interface SetNavigationBarColorOptions extends SuccessOptions {
    /**
     * 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
     */
    frontColor: '#ffffff' | '#000000';
    /**
     * 背景颜色值，有效值为十六进制颜色
     */
    backgroundColor: string;
    /**
     * 动画效果
     */
    animation?: SetNavigationBarColorAnimation;
  }

  /**
   * 设置导航条颜色，动画
   * @param {SetNavigationBarColorOptions} options
   * @version 1.4.0
   */
  export function setNavigationBarColor(options: SetNavigationBarColorOptions): void;

  export interface SetTabBarBadgeOptions extends BaseOptions {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number;
    /**
     * 显示的文本，超过 3 个字符则显示成“…”
     */
    text: string;
  }

  /**
   * 为 tabBar 某一项的右上角添加文本
   * @param {SetTabBarBadgeOptions} options
   * @version 1.9.0
   */
  export function setTabBarBadge(options: SetTabBarBadgeOptions): void;

  export interface RemoveTabBarBadgeOptions extends BaseOptions {
    /**
     * tabBar的哪一项，从左边算起
     */
    index: number;
  }

  /**
   * 移除 tabBar 某一项右上角的文本
   * @param {RemoveTabBarBadgeOptions} options
   * @version 1.9.0
   */
  export function removeTabBarBadge(options: RemoveTabBarBadgeOptions): void;

  /**
   * 显示 tabBar 某一项的右上角的红点
   * @param {BaseOptions} options
   * @version 1.9.0
   */
  export function showTabBarRedDot(options: BaseOptions): void;

  /**
   * 隐藏 tabBar 某一项的右上角的红点
   * @param {BaseOptions} options
   * @version 1.9.0
   */
  export function hideTabBarRedDot(options: BaseOptions): void;

  export interface SetTabBarStyleOptions extends BaseOptions {
    /**
     * tab 上的文字默认颜色
     */
    color: string;
    /**
     * tab 上的文字选中时的颜色
     */
    selectedColor: string;
    /**
     * tab 的背景色
     */
    backgroundColor: string;
    /**
     * tabbar上边框的颜色， 仅支持 black/white
     */
    borderStyle: 'black' | 'white'
  }

  /**
   * 动态设置 tabBar 的整体样式
   * @param {SetTabBarStyleOptions} options
   * @version 1.9.0
   */
  export function setTabBarStyle(options: SetTabBarStyleOptions): void;

  export interface SetTabBarItemOptions extends BaseOptions {
    /**
     * tabBar 的哪一项，从左边算起
     */
    index: number;
    /**
     * tab 上按钮文字
     */
    text?: string;
    /**
     * 图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px，当 postion 为 top 时，此参数无效，不支持网络图片
     */
    iconPath?: string;
    /**
     *  选中时的图片路径，icon 大小限制为40kb，建议尺寸为 81px * 81px ，当 postion 为 top 时，此参数无效
     */
    selectedIconPath?: string;
  }

  /**
   * 动态设置 tabBar 某一项的内容
   * @param {SetTabBarItemOptions} options
   * @version 1.9.0
   */
  export function setTabBarItem(options: SetTabBarItemOptions): void;

  export interface HasShowTabBarOptions extends BaseOptions {
    /**
     *  是否需要动画效果，默认无
     */
    aniamtion?: boolean;
  }

  /**
   * 隐藏 tabBar
   * @param {HasShowTabBarOptions} options
   * @version 1.9.0
   */
  export function hideTabBar(options: HasShowTabBarOptions): void;

  /**
   * 显示 tabBar
   * @param {HasShowTabBarOptions} options
   * @version 1.9.0
   */
  export function showTabBar(options: HasShowTabBarOptions): void;

  export interface SetTopBarTextOptions extends BaseOptions {
    /**
     * 置顶栏文字内容
     */
    text: string;
  }

  /**
   * 动态设置置顶栏文字内容，只有当前小程序被置顶时能生效，
   * 如果当前小程序没有被置顶，也能调用成功，但是不会立即生效，只有在用户将这个小程序置顶后才换上设置的文字内容。
   * 注意：调用成功后，需间隔 5s 才能再次调用此接口，如果在 5s 内再次调用此接口，
   * 会回调 fail，errMsg："setTopBarText: fail invoke too frequently"
   * @param {SetTopBarTextOptions} options
   */
  export function setTopBarText(options: SetTopBarTextOptions): void;

  export interface NavigateToOptions extends BaseOptions {
    /**
     * 需要跳转的应用内页面的路径 , 路径后可以带参数。
     * 参数与路径之间使用?分隔，参数键与参数值用=相连，不同参数用&分隔；如 'path?key=value&key2=value2'
     * 注意：目前页面路径最多只能十层。
     */
    url: string;
  }

  /**
   * 保留当前页面，跳转到应用内的某个页面，使用 `wx.navigateBack` 可以返回到原页面。
   */
  export function navigateTo(options: NavigateToOptions): void;

  /**
   * 关闭当前页面，跳转到应用内的某个页面。
   */
  export function redirectTo(options: NavigateToOptions): void;

  /**
   * 关闭所有页面，打开到应用内的某个页面。
   * @param {wx.NavigateToOptions} options
   * @version 1.1.0
   */
  export function reLaunch(options: NavigateToOptions): void;

  export interface SwitchTabOptions extends BaseOptions {
    /**
     * 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数
     */
    url: string;
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  export function switchTab(options: SwitchTabOptions): void;

  export interface NavigateBackOptions {
    /**
     * 返回的页面数，如果 delta 大于现有页面数，则返回到首页。默认值为1。
     */
    delta?: number;
  }

  /**
   * 关闭当前页面，返回上一页面或多级页面。可通过 `getCurrentPages()` 获取当前的页面栈，决定需要返回几层。
   */
  export function navigateBack(options: NavigateBackOptions): void;

  /**
   * 动画实例可以调用以下方法来描述动画，调用结束后会返回自身，支持链式调用的写法。
   */
  export interface Animation {
    /**
     * 表示一组动画完成，可以在一组动画中调用任意多个动画方法，一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画。
     */
    step(options?: AnimationOptions): void;

    /**
     * 导出动画数据传递给组件的animation属性
     */
    export(): any;

    // 样式

    /**
     * 透明度，参数范围 0~1
     */
    opacity(value: number): this;

    /**
     * 颜色值
     */
    backgroundColor(color: string): this;

    /**
     * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
     */
    width(value: number | string): this;

    /**
     * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
     */
    height(value: number | string): this;

    /**
     * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
     */
    top(value: number | string): this;

    /**
     * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
     */
    left(value: number | string): this;

    /**
     * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
     */
    bottom(value: number | string): this;

    /**
     * 长度值，如果传入 number 则默认使用 px，可传入其他自定义单位的长度值
     */
    right(value: number | string): this;

    // 旋转

    /**
     * deg的范围-180~180，从原点顺时针旋转一个deg角度
     */
    rotate(value: number): this;

    /**
     * deg的范围-180~180，在X轴旋转一个deg角度
     */
    rotateX(value: number): this;

    /**
     * deg的范围-180~180，在Y轴旋转一个deg角度
     */
    rotateY(value: number): this;

    /**
     * deg的范围-180~180，在Z轴旋转一个deg角度
     */
    rotateZ(value: number): this;

    /**
     * 同 [transform-function rotate3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate3d?t=1477656494026)
     */
    rotate3d(x: number, y: number, z: number, a: number): this;

    // 缩放

    /**
     * 一个参数时，表示在X轴、Y轴同时缩放sx倍数；两个参数时表示在X轴缩放sx倍数，在Y轴缩放sy倍数
     */
    scale(sx: number, sy?: number): this;

    /**
     * 在X轴缩放sx倍数
     */
    scaleX(sx: number): this;

    /**
     * 在Y轴缩放sy倍数
     */
    scaleY(sy: number): this;

    /**
     * 在Z轴缩放sz倍数
     */
    scaleZ(sz: number): this;

    /**
     * 在X轴缩放sx倍数，在Y轴缩放sy倍数，在Z轴缩放sz倍数
     */
    scale3d(sx: number, sy: number, sz: number): this;

    // 偏移

    /**
     * 一个参数时，表示在X轴偏移tx，单位px；两个参数时，表示在X轴偏移tx，在Y轴偏移ty，单位px。
     */
    translate(tx: number, ty?: number): this;

    /**
     * 在X轴偏移tx，单位px
     */
    translateX(tx: number): this;

    /**
     * 在Y轴偏移ty，单位px
     */
    translateY(ty: number): this;

    /**
     * 在Z轴偏移tz，单位px
     */
    translateZ(tz: number): this;

    /**
     * 在X轴偏移tx，在Y轴偏移ty，在Z轴偏移tz，单位px
     */
    translate3d(tx: number, ty: number, tz: number): this;

    // 倾斜

    /**
     * 参数范围-180~180；一个参数时，Y轴坐标不变，X轴坐标延顺时针倾斜ax度；两个参数时，分别在X轴倾斜ax度，在Y轴倾斜ay度
     */
    skew(ax: number, ay?: number): this;

    /**
     * 参数范围-180~180；Y轴坐标不变，X轴坐标延顺时针倾斜ax度
     */
    skewX(ax: number): this;

    /**
     * 参数范围-180~180；X轴坐标不变，Y轴坐标延顺时针倾斜ay度
     */
    skewY(ay: number): this;

    // 矩阵变形

    /**
     * 同 [transform-function matrix](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix?t=1477656494026)
     */
    matrix(a: number,
           b: number,
           c: number,
           d: number,
           tx: number,
           ty: number): this;

    /**
     * 同 [transform-function matrix3d](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix3d?t=1477656494026)
     */
    matrix3d(a1: number,
             b1: number,
             c1: number,
             d1: number,
             a2: number,
             b2: number,
             c2: number,
             d2: number,
             a3: number,
             b3: number,
             c3: number,
             d3: number,
             a4: number,
             b4: number,
             c4: number,
             d4: number): this;
  }

  export interface AnimationOptions {
    /**
     * 动画持续时间，单位ms，默认值 400
     */
    duration?: number;

    /**
     * 定义动画的效果，默认值"linear"
     */
    timingFunction?: | "linear"
      | "ease"
      | "ease-in"
      | "ease-in-out"
      | "ease-out"
      | "step-start"
      | "step-end";

    /**
     * 动画延迟时间，单位 ms，默认值 0
     */
    delay?: number;

    /**
     * 设置transform-origin，默认为"50% 50% 0"
     */
    transformOrigin?: string;
  }

  export function createAnimation(options?: AnimationOptions): Animation;

  export interface PageScrollToOptions {
    /**
     * 滚动到页面的目标位置（单位px）
     */
    scrollTop: number;
    /**
     * 滚动动画的时长，默认300ms，单位 ms
     */
    duration?: number;
  }

  /**
   * 将页面滚动到目标位置。
   * @param {PageScrollToOptions} options
   */
  export function pageScrollTo(options: PageScrollToOptions): void;

  export interface CanvasContext {
    /**
     * 获取当前 `context` 上存储的绘图动作
     */
    getActions(): any[];

    /**
     * 清空当前的存储绘图动作
     */
    clearActions(): void;

    // 变形

    /**
     * 在调用 `scale` 方法后，之后创建的路径其横纵坐标会被缩放。多次调用 `scale`，倍数会相乘。
     * @param scaleWidth 横坐标缩放的倍数
     * @param scaleHeight 纵坐标轴缩放的倍数
     */
    scale(scaleWidth: number, scaleHeight: number): void;

    /**
     * 以原点为中心，原点可以用 translate方法修改。顺时针旋转当前坐标轴。多次调用rotate，旋转的角度会叠加。
     * @param rotate 旋转角度，以弧度计，范围为 0 ~ 2π
     */
    rotate(rotate: number): void;

    /**
     * 对当前坐标系的原点(0, 0)进行变换，默认的坐标系原点为页面左上角。
     * @param x 水平坐标平移量
     * @param y 竖直坐标平移量
     */
    translate(x: number, y: number): void;

    /**
     * 保存当前坐标轴的缩放、旋转、平移信息
     */
    save(): void;

    /**
     * 恢复之前保存过的坐标轴的缩放、旋转、平移信息
     */
    restore(): void;

    // 绘制

    /**
     * 清除画布上在该矩形区域内的内容。
     * @param x 矩形区域左上角的x坐标
     * @param y 矩形区域左上角的y坐标
     * @param width 矩形区域的宽度
     * @param height 矩形区域的高度
     */
    clearRect(x: number, y: number, width: number, height: number): void;

    /**
     * 在画布上绘制被填充的文本。
     * @param text 在画布上输出的文本
     * @param x  绘制文本的左上角x坐标位置
     * @param y 绘制文本的左上角y坐标位置
     */
    fillText(text: string, x: number, y: number): void;

    /**
     * 绘制图像，图像保持原始尺寸。
     * @param imageResource 所要绘制的图片资源，通过 `chooseImage` 得到一个文件路径或者一个项目目录内的图片
     * @param x 图像左上角的x坐标
     * @param y 图像左上角的y坐标
     */
    drawImage(imageResource: string,
              x: number,
              y: number,
              width: number,
              height: number): void;

    /**
     * 对当前路径进行填充
     */
    fill(): void;

    /**
     * 对当前路径进行描边
     */
    stroke(): void;

    // 路径后可以带参数。

    /**
     * 开始创建一个路径，需要调用fill或者stroke才会使用路径进行填充或描边。
     * 同一个路径内的多次 `setFillStyle`、`setStrokeStyle`、`setLineWidth` 等设置，以最后一次设置为准。
     */
    beginPath(): void;

    /**
     * 关闭一个路径
     */
    closePath(): void;

    /**把路径移动到画布中的指定点，不创建线条。
     * @param x 目标位置的x坐标
     * @param y 目标位置的y坐标
     */
    moveTo(x: number, y: number): void;

    /**
     * 在当前位置添加一个新点，然后在画布中创建从该点到最后指定点的路径。
     * @param x 目标位置的x坐标
     * @param y 目标位置的y坐标
     */
    lineTo(x: number, y: number): void;

    /**
     * 画一条弧线。
     * 创建一个圆可以用 arc() 方法指定其实弧度为0，终止弧度为 2 * Math.PI。
     * 用 stroke() 或者 fill() 方法来在 canvas 中画弧线。
     * @param x 圆的x坐标
     * @param y 圆的y坐标
     * @param r 圆的半径
     * @param sAngle 起始弧度，单位弧度（在3点钟方向）
     * @param eAngle 终止弧度
     * @param counterclockwise 可选。指定弧度的方向是逆时针还是顺时针。默认是false，即顺时针。
     */
    arc(x: number,
        y: number,
        r: number,
        sAngle: number,
        eAngle: number,
        counterclockwise?: boolean): void;

    /**
     * 添加一个矩形路径到当前路径。
     * @param x 矩形路径左上角的x坐标
     * @param y 矩形路径左上角的y坐标
     * @param width 矩形路径的宽度
     * @param height 矩形路径的高度
     */
    rect(x: number, y: number, width: number, height: number): void;

    /**
     * 填充一个矩形。用 setFillStyle() 设置矩形的填充色，如果没设置默认是黑色。
     * @param x 矩形路径左上角的x坐标
     * @param y 矩形路径左上角的y坐标
     * @param width 矩形路径的宽度
     * @param height 矩形路径的高度
     */
    fillRect(x: number, y: number, width: number, height: number): void;

    /**
     * 画一个矩形(非填充)。用 setFillStroke() 设置矩形线条的颜色，如果没设置默认是黑色。
     * @param x 矩形路径左上角的x坐标
     * @param y 矩形路径左上角的y坐标
     * @param width 矩形路径的宽度
     * @param height 矩形路径的高度
     */
    strokeRect(x: number, y: number, width: number, height: number): void;

    /**
     * 创建二次贝塞尔曲线路径。
     * @param cpx 贝塞尔控制点的x坐标
     * @param cpy 贝塞尔控制点的y坐标
     * @param x 结束点的x坐标
     * @param y 结束点的y坐标
     */
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;

    /**
     * 创建三次方贝塞尔曲线路径。
     * @param cp1x 第一个贝塞尔控制点的 x 坐标
     * @param cp1y 第一个贝塞尔控制点的 y 坐标
     * @param cp2x 第二个贝塞尔控制点的 x 坐标
     * @param cp2y 第二个贝塞尔控制点的 y 坐标
     * @param x 结束点的x坐标
     * @param y 结束点的y坐标
     */
    bezierCurveTo(cp1x: number,
                  cp1y: number,
                  cp2x: number,
                  cp2y: number,
                  x: number,
                  y: number): void;

    // 样式

    /**
     * 设置纯色填充。
     * @param color 设置为填充样式的颜色('rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串)
     */
    setFillStyle(color: string): void;

    /**
     * 设置纯色描边
     * @param color 设置为填充样式的颜色('rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串)
     */
    setStrokeStyle(color: string): void;

    /**
     * 设置全局画笔透明度。
     * @param alpha 透明度，0 表示完全透明，1 表示完全不透明
     */
    setGlobalAlpha(alpha: number): void;

    /**
     * 设置阴影样式。
     * @param offsetX 阴影相对于形状在水平方向的偏移
     * @param offsetY 阴影相对于形状在竖直方向的偏移
     * @param blur 阴影的模糊级别，数值越大越模糊(0~100)
     * @param color 阴影的颜色('rgb(255, 0, 0)'或'rgba(255, 0, 0, 0.6)'或'#ff0000'格式的颜色字符串)
     */
    setShadow(offsetX: number,
              offsetY: number,
              blur: number,
              color: string): void;

    /**
     * 创建一个线性的渐变颜色。需要使用 addColorStop() 来指定渐变点，至少要两个。
     * @param x0 起点的x坐标
     * @param y0 起点的y坐标
     * @param x1 终点的x坐标
     * @param y1 终点的y坐标
     */
    createLinearGradient(x0: number, y0: number, x1: number, y1: number): void;

    /**
     * 创建一个圆形的渐变颜色。起点在圆心，终点在圆环。需要使用 addColorStop() 来指定渐变点，至少要两个。
     * @param x 圆心的x坐标
     * @param y 圆心的y坐标
     * @param r 圆的半径
     */
    createCircularGradient(x: number, y: number, r: number): void;

    /**
     * 设置字体的字号。
     * @param fontSize 字体的字号
     */
    setFontSize(fontSize: number): void;

    /**
     * 设置线条的宽度。
     * @param lineWidth 线条的宽度
     */
    setLineWidth(lineWidth: number): void;

    /**
     * 设置线条的结束端点样式。
     * @param lineCap 线条的结束端点样式('butt'、'round'、'square')
     */
    setLineCap(lineCap: string): void;

    /**
     * 设置两条线相交时，所创建的拐角类型。
     * @param lineJoin 两条线相交时，所创建的拐角类型('bevel'、'round'、'miter')
     */
    setLineJoin(lineJoin: string): void;

    /**设置最大斜接长度，斜接长度指的是在两条线交汇处内角和外角之间的距离。 当setLineJoin为'miter'时才有效。超过最大倾斜长度的，连接处将以lineJoin为bevel来显示
     * @param miterLimit 最大斜接长度
     */
    setMiterLimit(miterLimit: number): void;
  }

  /**
   * 创建 canvas 绘图上下文(指定 canvasId)
   * @param canvasId 画布表示，传入定义在 <canvas/> 的 canvas-id
   */
  export function createCanvasContext(canvasId: string): CanvasContext;

  /**
   * 创建并返回绘图上下文context对象。
   */
  export function createContext(): CanvasContext;

  export interface DrawCanvasOptions {
    /**
     * 画布标识，传入 <canvas/> 的 cavas-id
     */
    canvasId: string;

    /**
     * 绘图动作数组，由 wx.createContext 创建的 context，调用 getActions 方法导出绘图动作数组。
     */
    actions: any[];

    /**
     * 本次绘制是否接着上一次绘制，即reserve参数为false，则在本次调用drawCanvas绘制之前native层应先清空画布再继续绘制；
     * 若reserver参数为true，则保留当前画布上的内容，本次调用drawCanvas绘制的内容覆盖在上面，默认 false
     */
    reserve?: boolean;
  }

  /**
   * 绘制画布
   */
  export function drawCanvas(options: DrawCanvasOptions): void;

  export interface CanvasToTempFilePathOptions {
    /**
     * 画布标识，传入 <canvas/> 的 cavas-id
     */
    canvasId: string;
  }

  /**
   * 把当前画布的内容导出生成图片，并返回文件路径
   */
  export function canvasToTempFilePath(options: CanvasToTempFilePathOptions): string;

  /**
   * 开始下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致
   * @param {SuccessOptions} options
   * @version 1.5.0
   */
  export function startPullDownRefresh(options: SuccessOptions): void;

  /**
   * 停止当前页面下拉刷新。
   */
  export function stopPullDownRefresh(): void;

  // ---------------------------------- WXML节点信息 ----------------------------------

  export interface FieldsOptions {
    /**
     * 是否返回节点id
     */
    id?: boolean;
    /**
     * 是否返回节点dataset
     */
    dataset?: boolean;
    /**
     * 是否返回节点布局位置（left right top bottom）
     */
    rect?: boolean;
    /**
     * 是否返回节点尺寸（width height）
     */
    size?: boolean;
    /**
     * 是否返回节点的 scrollLeft scrollTop ，节点必须是scroll-view或者viewport
     */
    scrollOffset?: boolean;
    /**
     * 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值， id class style 和事件绑定的属性值不可获取）
     */
    properties: any[]
  }

  export interface NodesRef {
    /**
     * 添加节点的布局位置的查询请求，相对于显示区域，以像素为单位。
     * @param {wx.IData} rect
     * @returns {wx.SelectQuery}
     */
    boundingClientRect(rect: IData): SelectQuery;

    /**
     * 添加节点的滚动位置查询请求，以像素为单位。
     * @param {wx.IData} res
     * @returns {wx.SelectQuery}
     */
    scrollOffset(res: IData): SelectQuery;

    /**
     * 获取节点的相关信息，需要获取的字段在fields中指定。
     * @param {FieldsOptions} fields
     * @param {wx.IData} res
     * @returns {wx.SelectQuery}
     */
    fields(fields: FieldsOptions, res: IData): SelectQuery;
  }

  export interface SelectQuery {
    /**
     * 将选择器的选取范围更改为自定义组件component内。
     * @param context
     * @returns {wx.SelectQuery}
     * @version 1.6.0
     */
    in(context: any): SelectQuery

    /**
     * 在当前页面下选择第一个匹配选择器selector的节点，返回一个NodesRef对象实例，可以用于获取节点信息。
     * @param {string} selector - 类似于css的选择器
     * @returns {NodesRef}
     */
    select(selector: string): NodesRef;

    /**
     * 在当前页面下选择所有匹配选择器selector的节点
     * @param {string} selector
     * @returns {NodesRef}
     */
    selectAll(selector: string): NodesRef;

    /**
     * 选择显示区域，可用于获取显示区域的尺寸、滚动位置等信息
     * @returns {NodesRef}
     */
    selectViewport(): NodesRef;

    /**
     * 执行所有的请求，请求结果按请求次序构成数组，在callback的第一个参数中返回。
     * @param {wx.IData} res
     */
    exec(res: IData): void;
  }

  /**
   * 返回一个SelectorQuery对象实例。
   * @returns {SelectQuery}
   * @version 1.4.0
   */
  export function createSelectorQuery(): SelectQuery;

  // ---------------------------------- 第三方平台 ----------------------------------

  export interface GetExtConfigOptions extends SuccessOptions {
    /**
     * 第三方平台自定义的数据
     */
    extConfig: IData;
  }

  /**
   * 获取第三方平台自定义的数据字段。
   * @param {GetExtConfigOptions} options
   * @version 1.1.0
   */
  export function getExtConfig(options: GetExtConfigOptions): void;

  /**
   * 获取第三方平台自定义的数据字段的同步接口。
   * @returns {{extConfig: wx.IData}}
   * @version 1.1.0
   */
  export function getExtConfigSync(): { extConfig: IData };

  // ---------------------------------- 开放接口API列表 ----------------------------------

  export interface LoginResult {
    /**
     * 调用结果
     */
    errMsg: string;

    /**
     * 用户允许登录后，回调内容会带上 code（有效期五分钟），开发者需要将 code 发送到开发者服务器后台，
     * 使用 `code` 换取 `session_key` api，将 code 换成 openid 和 session_key
     */
    code: string;
  }

  export interface LoginOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: LoginResult) => void;
  }

  /**
   * 调用接口获取**登录凭证（code）**进而换取用户登录态信息，
   * 包括用户的**唯一标识（openid）** 及本次登录的 **会话密钥（session_key）**。**用户数据的加解密通讯**需要依赖会话密钥完成。
   */
  export function login(options: LoginOptions): void;

  /**
   * 检查登陆态是否过期
   */
  export function checkSession(options: BaseOptions): void;

  export interface AuthorizeOptions extends SuccessOptions {
    /**
     * 需要获取权限的scope，详见 scope 列表
     */
    scope: string;
  }

  /**
   * 提前向用户发起授权请求。
   * 调用后会立刻弹窗询问用户是否同意授权小程序使用某项功能或获取用户的某些数据，但不会实际调用对应接口。
   * 如果用户之前已经同意授权，则不会出现弹窗，直接返回成功。
   * @param {AuthorizeOptions} options
   */
  export function authorize(options: AuthorizeOptions): void;

  export interface GetUserInfoResult {
    /**
     * 用户信息对象，不包含 openid 等敏感信息
     */
    userInfo: UserInfo;

    /**
     * 不包括敏感信息的原始数据字符串，用于计算签名。
     */
    rawData: string;

    /**
     * 使用 sha1( rawData + sessionkey ) 得到字符串，用于校验用户信息。
     */
    signature: string;

    /**
     * 包括敏感数据在内的完整用户信息的加密数据，详细见加密数据解密算法
     */
    encryptData: string;

    /**
     * 加密算法的初始向量，详细见加密数据解密算法
     */
    iv: string;
  }

  /**
   * 用户信息
   */
  export interface UserInfo {
    /**
     * 用户昵称
     */
    nickName: string;

    /**
     * 头像地址
     */
    avatarUrl: string;

    /**
     * 性别 0：未知、1：男、2：女
     */
    gender: number;

    /**
     * 省份
     */
    province: string;

    /**
     * 城市
     */
    city: string;

    /**
     * 国家
     */
    country: string;

    /**
     * language  String  用户的语言，简体中文为zh_CN
     */
    language: string;
  }

  export interface GetUserInfoOptions extends BaseOptions {
    /**
     * 是否带上登录态信息
     * @version 1.1.0
     */
    withCredentials?: boolean;
    /**
     * 指定返回用户信息的语言，zh_CN 简体中文，zh_TW 繁体中文，en 英文。默认为en。
     * @version 1.3.0
     */
    lang?: string;
    /**
     * 接口调用成功的回调函数
     */
    success?: (res: GetUserInfoResult) => void;
  }

  /**
   * 获取用户信息，需要先调用 wx.login 接口。
   */
  export function getUserInfo(options: GetUserInfoOptions): void;

  export interface RequestPaymentOptions extends BaseOptions {
    /**
     * 时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间
     */
    timeStamp: number;

    /**
     * 随机字符串，长度为32个字符以下。
     */
    nonceStr: string;

    /**
     * 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*
     */
    package: string;

    /**
     * 签名算法，暂支持 MD5
     */
    signType: string;

    /**
     * 签名,具体签名方案参见[微信公众号支付帮助文档](https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=4_3&t=1477656495417)
     */
    paySign: string;
  }

  /**
   * 发起微信支付。
   */
  export function requestPayment(options: RequestPaymentOptions): void;

  export interface ShowShareMenuOptions extends BaseOptions {
    /**
     *  是否使用带 shareTicket 的转发详情
     */
    withShareTicket: boolean;
  }

  /**
   * 显示当前页面的转发按钮
   * @param {ShowShareMenuOptions} options
   * @version 1.1.0
   */
  export function showShareMenu(options: ShowShareMenuOptions): void;

  /**
   * 隐藏转发按钮
   * @param {BaseOptions} options
   * @version 1.1.0
   */
  export function hideShareMenu(options: BaseOptions): void;

  /**
   * 更新转发属性
   * @param {ShowShareMenuOptions} options
   * @version 1.2.0
   */
  export function updateShareMenu(options: ShowShareMenuOptions): void;

  export interface GetShareInfoResult {
    /**
     * 错误信息
     */
    errMsg: string;
    /**
     * 包括敏感数据在内的完整转发信息的加密数据，详细见加密数据解密算法
     */
    encryptedData: string;
    /**
     * 加密算法的初始向量，详细见加密数据解密算法
     */
    iv: string;
  }

  export interface GetShareInfoOptions extends BaseOptions {
    shareTicket: string;
    /**
     * 接口调用成功的回调函数
     * @param {GetShareInfoResult} res
     */
    success?: (res: GetShareInfoResult) => void;
    /**
     * 接口调用失败的回调函数
     * @param {GetShareInfoResult} res
     */
    fail?: (res: GetShareInfoResult) => void;
    /**
     * 接口调用结束的回调函数（调用成功、失败都会执行）
     * @param {GetShareInfoResult} res
     */
    complete?: (res: GetShareInfoResult) => void;
  }

  /**
   * 获取转发详细信息
   * @param {GetShareInfoOptions} options
   * @version 1.1.0
   */
  export function getShareInfo(options: GetShareInfoOptions): void;

  export interface ChooseAddressOptions extends SuccessOptions {
    /**
     * 收货人姓名
     */
    userName: string;
    /**
     * 邮编
     */
    postalCode: string;
    /**
     * 国标收货地址第一级地址
     */
    provinceName: string;
    /**
     * 国标收货地址第二级地址
     */
    cityName: string;
    /**
     * 国标收货地址第三级地址
     */
    countyName: string;
    /**
     * 详细收货地址信息
     */
    detailInfo: string;
    /**
     * 收货地址国家码
     */
    nationalCode: string;
    /**
     * 收货人手机号码
     */
    telNumber: string;
  }

  /**
   * 调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
   * @param {ChooseAddressOptions} options
   * @version 1.1.0
   */
  export function chooseAddress(options: ChooseAddressOptions): void;

  export interface Card {
    /**
     * 卡券 Id
     */
    cardId: string;
    /**
     * 卡券的扩展参数
     */
    cardExt: string;
  }

  export interface CardItem extends Card {
    /**
     * 加密 code，为用户领取到卡券的code加密后的字符串
     */
    code: string;
    /**
     * 是否成功
     */
    isSuccess: boolean;
  }

  export interface AddCardOptions extends BaseOptions {
    /**
     * 需要添加的卡券列表
     */
    cardList: Card[]

    /**
     * 卡券添加结果列表
     * @param {{cardList: CardItem[]}} res
     */
    success?: (res: { cardList: CardItem[] }) => void;
  }

  /**
   * 批量添加卡券。
   * @param {AddCardOptions} options
   * @version 1.1.0
   */
  export function addCard(options: AddCardOptions): void;

  export interface openCardItem {
    /**
     * 需要打开的卡券 Id
     */
    cardId: string;
    /**
     * 由 addCard 的返回对象中的加密 code 通过解密后得到
     */
    code: string;
  }

  export interface OpenCardOptions extends BaseOptions {
    /**
     *  需要打开的卡券列表
     */
    cardList: openCardItem[]
  }

  /**
   * 查看微信卡包中的卡券。
   * @param {OpenCardOptions} options
   * @version 1.1.0
   */
  export function openCard(options: OpenCardOptions): void;

  export interface SettingOptions {
    /**
     * 用户授权结果，其中 key 为 scope 值，value 为 Bool 值，表示用户是否允许授权，
     * @param {{authSetting: wx.IData}} res
     */
    success?: (res: { authSetting: IData }) => void;
  }

  /**
   * 调起客户端小程序设置界面，返回用户设置的操作结果。
   * @param {SettingOptions} options
   * @version 1.1.0
   */
  export function openSetting(options: SettingOptions): void;

  /**
   * 获取用户的当前设置。
   * @param {SettingOptions} options
   * @version 1.1.0
   */
  export function getSetting(options: SettingOptions): void;

  export interface NavigateToMiniProgramOptions extends SuccessOptions {
    /**
     * 要打开的小程序 appId
     */
    appId: string;
    /**
     * 打开的页面路径，如果为空则打开首页
     */
    path?: string;
    /**
     *  需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
     */
    extraData?: IData;
    /**
     * 要打开的小程序版本，有效值 develop（开发版），trial（体验版），release（正式版） ，
     * 仅在当前小程序为开发版或体验版时此参数有效；
     * 如果当前小程序是体验版或正式版，则打开的小程序必定是正式版。
     * 默认值 release
     */
    envVersion?: string;
  }

  /**
   * 打开同一公众号下关联的另一个小程序。
   * @param {NavigateToMiniProgramOptions} options
   * @version 1.3.0
   */
  export function navigateToMiniProgram(options: NavigateToMiniProgramOptions): void;

  export interface NavigateBackMiniProgramOptions extends SuccessOptions {
    /**
     * 需要返回给上一个小程序的数据，上一个小程序可在 App.onShow() 中获取到这份数据。
     */
    extraData?: IData;
  }

  /**
   * 返回到上一个小程序，只有在当前小程序是被其他小程序打开时可以调用成功
   * @param {NavigateBackMiniProgramOptions} options
   * @version 1.3.0
   */
  export function navigateBackMiniProgram(options: NavigateBackMiniProgramOptions): void;

  export interface ChooseInvoiceTitleResult {
    /**
     * 抬头类型（0：单位，1：个人）
     */
    type: string;
    /**
     * 抬头名称
     */
    title: string;
    /**
     * 抬头税号
     */
    taxNumber: string;
    /**
     * 单位地址
     */
    companyAddress: string;
    /**
     * 手机号码
     */
    telephone: string;
    /**
     * 银行名称
     */
    bankName: string;
    /**
     * 银行账号
     */
    bankAccount: string;
    /**
     * 接口调用结果
     */
    errMsg: string;
  }

  export interface ChooseInvoiceTitleOptions extends BaseOptions {
    /**
     * 接口调用成功的回调函数
     * @param {wx.ChooseInvoiceTitleResult} res
     */
    success?: (res: ChooseInvoiceTitleResult) => void;
  }

  /**
   * 选择用户的发票抬头。
   * @param {ChooseInvoiceTitleOptions} options
   * @version 1.5.0
   */
  export function chooseInvoiceTitle(options: ChooseInvoiceTitleOptions): void;
}
