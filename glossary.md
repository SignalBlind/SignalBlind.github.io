---
layout: page
title: Glossary
permalink: /glossary/
order: 50
description: Definitions of key terms used throughout this site
---

## Glossary

{% for item in site.data.glossary %}
<div class="glossary-entry" id="{{ item.term | slugify }}" markdown="1">

### {{ item.term }}

{% if item.alternates %}**Also:** {{ item.alternates | join: ", " }}{% endif %}

{% if item.full %}**{{ item.full }}**{% endif %}

{{ item.definition }}

</div>
{% endfor %}
