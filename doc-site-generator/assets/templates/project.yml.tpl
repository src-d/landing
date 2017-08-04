category: {{.Category}}
name: {{.Name}}
version: {{.Version}}
repository: {{.Repository}}
projectUrl: https://github.com/{{.Repository}}
repoVersionUrl: https://github.com/{{.Repository}}/releases/tag/{{.Version}}
releasesUrl: https://github.com/{{.Repository}}/releases
supportUrl: https://github.com/{{.Repository}}/issues
baseURL: //{{.BaseURL}}
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
  - name: dummy
    url: "#"
examples:
  - name: Basic
    url: "#basic"
  - name: Advanced
    url: "#advanced"
  - name: Code example
    url: "#code-example"
home:
  - name: installation
    url: "#installation"
  - name: examples
    url: "#examples"
  - name: contribute
    url: "#contribute"
  - name: license
    url: "#license"
