Just a checklist for myself I have to do manually for a release.

- Increase version in *android/app/build.gradle*
  - versionName "1.0" home screen
  
- Update changelog
- git tag v1.5 && git push origin v1.5 
- Upload binary to Github Release
cd android && ./gradlew assembleRelease 


todo:
whatsapp.zip fix perm