category: {{.Category}}
name: {{.Name}}
version: {{.Version}}
repository: {{.Repository}}
projectUrl: https://github.com/{{.Repository}}
repoVersionUrl: https://github.com/{{.Repository}}/releases/tag/{{.Version}}
releasesUrl: https://github.com/{{.Repository}}/releases
supportUrl: https://github.com/{{.Repository}}/issues
baseURL: {{.BaseURL}}
languages:
  {{- range $lang := .Languages }}
  {{- if ne 0 (len $lang)}}
  - {{ $lang }}
  {{- end -}}
  {{- end }}
logo: {{.Logo}}
logosmall: {{.Logosmall}}
codePill: "codepills/{{ .CodePill }}"
description: {{.Desc}}
badges:
  {{- range $badge := .Badges }}
  - name: {{ $badge.Name }}
    image: {{ $badge.Image }}
    url: {{ $badge.URL }}
  {{- end }}
tutorials:
  - name: summary
    items:
      - item: "[Instalation](instalation.md)"
      - item: "[Development](development.md)"
  - name: Examples of usage
    items:
      - item: "[pyspark](examples/pyspark.md)"
      - item: "[scala](examples/scala.md)"
examples:
  - name: basic
    items:
      - item: "[Basic+Example.ipynb](basic/Basic+Example.ipynb)"
home:
  - name: Quick start
    url: "#quick-start"
  - name: enry
    url: "#enry"
  - name: license
    url: "#license"
