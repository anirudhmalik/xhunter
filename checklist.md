Just a checklist for myself I have to do manually for a release.

- Increase version in *android/app/build.gradle*
  - versionName "1.0"
  
- Update changelog
- `git tag v1.XX` && `git push origin v1.XX` 
- Upload binary to Github Release
- uncomment payload.java main.js