---
layout: page
title: Tags
permalink: /tags/
order: 51
description: Browse content by tags
---

{% assign all_tags = "" | split: "" %}
{% for page in site.pages %}
  {% if page.tags %}
    {% for tag in page.tags %}
      {% unless all_tags contains tag %}
        {% assign all_tags = all_tags | push: tag %}
      {% endunless %}
    {% endfor %}
  {% endif %}
{% endfor %}

{% assign sorted_tags = all_tags | sort %}

<div class="tag-cloud">
{% for tag in sorted_tags %}
  {% assign tag_count = 0 %}
  {% for page in site.pages %}
    {% if page.tags contains tag %}
      {% assign tag_count = tag_count | plus: 1 %}
    {% endif %}
  {% endfor %}
  <a href="{{ '/tags/' | append: tag | append: '/' | relative_url }}" class="tag-link">
    <span class="tag-name">{{ tag }}</span>
    <span class="tag-count">({{ tag_count }})</span>
  </a>
{% endfor %}
</div>
