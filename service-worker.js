!function(){"use strict";const e=["client/client.5f6b2f21.js","client/about.cbebf256.js","client/[slug].c92075c7.js","client/index.18ddeea8.js","client/index.4a34caf8.js","client/client.afbdfe00.js"].concat(["service-worker-index.html","CNAME","Vijay_Resume_Latest.pdf","favicon.png","githubicon.svg","global.css","logo-192.png","logo-512.png","logo.png","logo.svg","main.css","manifest.json","outlookicon.svg","post-res/default.png","post-res/devpost.svg","post-res/emojicam/emojicam_thumb.mp4","post-res/emojicam/emojicamprocesspipeline.png","post-res/emojicam/emojicamprocesspipeline2.png","post-res/emojicam/test.mp4","post-res/emojicam/test_out-converted.mp4","post-res/emojicam/test_out_no_weights-converted.mp4","post-res/emojicam/test_out_stream-converted.mp4","post-res/emojicam/test_out_stream_wo_weight-converted.mp4","post-res/emojicamv2/dct_high_freq_example.png","post-res/emojicamv2/dct_low_freq_example.png","post-res/emojicamv2/emojicamprocesspipeline.png","post-res/emojicamv2/emojicamv2_thumb.png","post-res/emojicamv2/example_forest.png","post-res/emojicamv2/example_percentile_mask.png","post-res/emojicamv2/forest.jpg","post-res/emojicamv2/out_forest.jpg","post-res/emojicamv2/out_forest.jpg.png","post-res/emojicamv2/out_test.mp4","post-res/emojicamv2/test.mp4","post-res/emojicamv2/test_out-converted.mp4","post-res/emojicamv2/test_out.mp4","post-res/emojicamv2/thumbnail.jpeg","post-res/emojicamv2/thumbnail.png","post-res/eureca_face/11513D05.jpg","post-res/eureca_face/anim_header_1.mp4","post-res/eureca_face/eureca_face_thumb.png","post-res/eureca_face/he_fix_demo.png","post-res/eureca_face/median_demo.png","post-res/eureca_face/median_fix_demo.png","post-res/eureca_face/nlmf_demo.png","post-res/eureca_face/noise_comparison.png","post-res/eureca_face/noise_matrix.png","post-res/eureca_face/overview_gamma_graph.png","post-res/eureca_face/overview_gaussian_noise_graph.png","post-res/eureca_face/overview_he_gamma_dsfd.png","post-res/eureca_face/overview_he_gamma_retinaface.png","post-res/eureca_face/overview_median_gaussian_noise_dsfd.png","post-res/eureca_face/overview_median_gaussian_noise_retinaface.png","post-res/eureca_face/overview_median_poisson_dsfd.png","post-res/eureca_face/overview_median_poisson_retinaface.png","post-res/eureca_face/overview_median_salt_pepper_dsfd.png","post-res/eureca_face/overview_median_salt_pepper_retinaface.png","post-res/eureca_face/overview_poisson_graph.png","post-res/eureca_face/overview_salt_pepper_graph.png","post-res/eureca_face/overview_speckle_graph.png","post-res/eureca_face/ssim_avg_comparison.png","post-res/eureca_face/ssim_demo.png","post-res/food/food_thumb.png","post-res/food/thumbnail.kra","post-res/food/thumbnail.kra~","post-res/food/thumbnail.png","post-res/graduate_works/graduate_works_thumb.png","post-res/graduate_works/ieeepaper.kra","post-res/graduate_works/ieeepaper.png","post-res/graduate_works/omgthesis.kra","post-res/graduate_works/omgthesis.kra~","post-res/graduate_works/omgthesis.png","post-res/graduate_works/thumbnail.kra","post-res/graduate_works/thumbnail.kra~","post-res/graduate_works/thumbnail.png","post-res/image-filters/image-filters_thumb.png","post-res/image-filters/thumbnail.png","post-res/image-filters-bling/airplane2_mask.png","post-res/image-filters-bling/airplane2_out.png","post-res/image-filters-bling/airplane_final.mp4","post-res/image-filters-bling/airplane_final_mask.mp4","post-res/image-filters-bling/airplane_final_without_gaussian_blur.mp4","post-res/image-filters-bling/airplane_try_1.mp4","post-res/image-filters-bling/chart.png","post-res/image-filters-bling/example1.png","post-res/image-filters-bling/example_gradient.png","post-res/image-filters-bling/flare_template.png","post-res/image-filters-bling/image-filters-bling_thumb.mp4","post-res/image-filters-bling/mask_example.png","post-res/image-filters-bling/mask_example_2.png","post-res/image-filters-bling/style.css","post-res/image-filters-bling/truck.mp4","post-res/image-filters-bling/truck_mask.mp4","post-res/image-filters-corrupt/bill_gates_example1.jpeg","post-res/image-filters-corrupt/class_map_activation_diagram.png","post-res/image-filters-corrupt/corrupt_1_video.mp4","post-res/image-filters-corrupt/corruption_diagram_1.png","post-res/image-filters-corrupt/corruption_diagram_2.png","post-res/image-filters-corrupt/example1.mp4","post-res/image-filters-corrupt/example2.mp4","post-res/image-filters-corrupt/image-filters-corrupt_thumb.mp4","post-res/image-filters-corrupt/q-learning.png","post-res/image-filters-corrupt/q_learn_chart_example1.png","post-res/image-filters-corrupt/reward_space_example.png","post-res/image-filters-corrupt/style.css","post-res/image-filters-corrupt/test2_output.png","post-res/image-filters-corrupt/test3_output.png","post-res/image-filters-corrupt/tumble_example_2.png","post-res/masters_thesis_journey/masters_thesis_journey_thumb.png","post-res/masters_thesis_journey/thumbnail.jpeg","post-res/masters_thesis_journey/thumbnail.png","post-res/pen_plot/artwork.png","post-res/pen_plot/artwork_svg.png","post-res/pen_plot/holder.stl","post-res/pen_plot/holder_example.png","post-res/pen_plot/pen_plot_thumb.png","post-res/pen_plot/pen_plot_video.mp4","post-res/pen_plot/thumbnail.png","post-res/pixel_art/another-design-example-1.jpg","post-res/pixel_art/another-design-example-2.jpg","post-res/pixel_art/layer_1.svg","post-res/pixel_art/layer_viewer.js","post-res/pixel_art/layer_viewer_style.css","post-res/postar/postar_thumb.mp4","post-res/pseudo_lidar/20240413_174803.csv","post-res/pseudo_lidar/20240413_174803_processed.jpg","post-res/pseudo_lidar/20240414_115355.csv","post-res/pseudo_lidar/20240414_115355_processed.jpg","post-res/pseudo_lidar/20240414_120609.csv","post-res/pseudo_lidar/20240414_120609_processed.jpg","post-res/pseudo_lidar/20240414_120944.csv","post-res/pseudo_lidar/20240414_120944_processed.jpg","post-res/pseudo_lidar/20240414_123255.csv","post-res/pseudo_lidar/20240414_123255_processed.jpg","post-res/pseudo_lidar/gd.png","post-res/pseudo_lidar/gd1.png","post-res/pseudo_lidar/gd2.png","post-res/pseudo_lidar/gd3.png","post-res/pseudo_lidar/gd4.png","post-res/pseudo_lidar/pseudo_lidar_thumb.png","post-res/pseudo_lidar/thumbnail.png","post-res/pseudo_lidar/thumbnail.xcf","post-res/siammask_onnx_export/Untitled.xcf","post-res/siammask_onnx_export/car_example-converted.mp4","post-res/siammask_onnx_export/siamfc_diagram.png","post-res/siammask_onnx_export/siammask_diagram.jpeg","post-res/siammask_onnx_export/siammask_onnx_export_thumb.mp4","post-res/siammask_onnx_export/siamrpn_diagram.png","post-res/siammask_onnx_export/sot_example.png","post-res/siammask_onnx_export/tennis_example-converted.mp4","post-res/siammask_onnx_export/thumbnail.kra","post-res/siammask_onnx_export/thumbnail.kra~","post-res/snpe_android_1/demo1.mp4","post-res/snpe_android_1/end2end_timing","post-res/snpe_android_1/graph.py","post-res/snpe_android_1/graph_2.py","post-res/snpe_android_1/graph_3.py","post-res/snpe_android_1/mobilenetv2_cpu.txt","post-res/snpe_android_1/mobilenetv2_gpu.txt","post-res/snpe_android_1/mobilenetv2_gpu_fp16.txt","post-res/snpe_android_1/mobilenetv2_quant_cpu.txt","post-res/snpe_android_1/mobilenetv2_quant_gpu.txt","post-res/snpe_android_1/mobilenetv2_quant_gpu_fp16.txt","post-res/snpe_android_1/mobilenetv3_cpu.txt","post-res/snpe_android_1/mobilenetv3_gpu.txt","post-res/snpe_android_1/mobilenetv3_gpu_fp16.txt","post-res/snpe_android_1/mobilenetv3_quant_cpu.txt","post-res/snpe_android_1/mobilenetv3_quant_gpu.txt","post-res/snpe_android_1/mobilenetv3_quant_gpu_fp16.txt","post-res/snpe_android_1/performance.png","post-res/snpe_android_1/performance_infer.png","post-res/snpe_android_1/resnet18_cpu.txt","post-res/snpe_android_1/resnet18_gpu.txt","post-res/snpe_android_1/resnet18_gpu_fp16.txt","post-res/snpe_android_1/resnet18_quant_cpu.txt","post-res/snpe_android_1/resnet18_quant_gpu.txt","post-res/snpe_android_1/resnet18_quant_gpu_fp16.txt","post-res/snpe_android_1/snpe_android_1_thumb.png","post-res/yolov3msa/diagrams/ViT YOLO.png","post-res/yolov3msa/diagrams/all_dog_maps.png","post-res/yolov3msa/diagrams/all_voc_maps.png","post-res/yolov3msa/diagrams/darknet53_msa_structure.svg","post-res/yolov3msa/diagrams/darknet53_structure.svg","post-res/yolov3msa/diagrams/dog_all_loss.svg","post-res/yolov3msa/diagrams/lr_models.png","post-res/yolov3msa/diagrams/lr_yolov3.png","post-res/yolov3msa/diagrams/map_delta_dog.svg","post-res/yolov3msa/diagrams/map_delta_voc.svg","post-res/yolov3msa/diagrams/mosaic_example.png","post-res/yolov3msa/diagrams/pet_annotations.jpg","post-res/yolov3msa/diagrams/random_erase.PNG","post-res/yolov3msa/diagrams/voc2007_annotation_example.png","post-res/yolov3msa/diagrams/voc_all_loss.svg","post-res/yolov3msa/diagrams/yolov3_structure.svg","post-res/yolov3msa/diagrams/yolov3_structure_all_msas.svg","post-res/yolov3msa/style.css","post-res/yolov3msa/thumbnail.png","post-res/yolov3msa/yolov3msa_thumb.png","targetbtn_bg.svg","thread.css"]),s=new Set(e);self.addEventListener("install",s=>{s.waitUntil(caches.open("cache1719763006880").then(s=>s.addAll(e)).then(()=>{self.skipWaiting()}))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(async e=>{for(const s of e)"cache1719763006880"!==s&&await caches.delete(s);self.clients.claim()}))}),self.addEventListener("fetch",e=>{if("GET"!==e.request.method||e.request.headers.has("range"))return;const t=new URL(e.request.url);t.protocol.startsWith("http")&&(t.hostname===self.location.hostname&&t.port!==self.location.port||(t.host===self.location.host&&s.has(t.pathname)?e.respondWith(caches.match(e.request)):"only-if-cached"!==e.request.cache&&e.respondWith(caches.open("offline1719763006880").then(async s=>{try{const t=await fetch(e.request);return s.put(e.request,t.clone()),t}catch(t){const r=await s.match(e.request);if(r)return r;throw t}}))))})}();